const router = require("express").Router();
const { User, App, Link } = require("../DB/index.js");
const { errorMessage } = require("./error.js");
const { sendVerificationMail } = require("./mailer.js");

const generateID = async () => {

    const id = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('')
    
    const userMatches = await User.find({ id })
    const appMatches = await App.find({ id })

    if(userMatches.length > 0 && appMatches.length > 0) {
        const newID = await generateID();
        return newID;
    }

    return id;

}
const generateToken = async () => {

    const token = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('')
    
    const userMatches = await User.find({ token })
    const appMatches = await App.find({ token })

    if(userMatches.length > 0 && appMatches.length > 0) {
        const newToken = await generateToken();
        return newToken;
    }

    return token;

}
const generateURL = async () => {
    // TODO
    const verifyURl = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
    const linkMatches = await Link.find({ verifyURl })
    if(linkMatches.length > 0) {
        const newLink = await generateURL();
        return newLink;
    }
    return verifyURl;
}
const getUser = async (query) => {

    const matches = await User.find(query);

    if (matches.length == 1) {
        return matches[0];
    } else {
        return null;
    }

}
const getApp = async (query) => {

    const matches = await App.find(query);

    if (matches.length == 1) {
        return matches[0];
    } else {
        // return null;
        if(matches.length > 1) {
            return matches;
        } else {
            return null;
        }
    }

}
const getLink = async (query) => {

    const matches = await Link.find(query);

    if (matches.length == 1) {
        return matches[0];
    } else {
        return null;
    }

}
const hasPermissions = (app, user, neededPermission) => {

    if(app.member.length == 0) {
        return false;
    }
    return app.member.reduce((acc, cur) => {
        if (acc == true) return true;
        console.log(cur, user.id, neededPermission);
        if (cur[0] == user.id && cur[1] == neededPermission) return true;
        return false;
    }, false)

}
const isComplete = (obj) => {

    const keysObj = Object.keys(obj);
    return keysObj.reduce((acc, value) => {

        if (acc == false) return false;
        if (obj[value] == undefined || obj[value] == null) return false;
        return true;

    }, true)

}
const updateApp = async (query, update) => {

    await App.updateMany(query, update)

}
const updateUser = async (query, update) => {

    await User.updateMany(query, update)

}
const isAddedToApp = async (user, app) => {

    return user.apps.reduce((acc, value) => {
        if (acc == true) return true;
        if (value[0] == app.id) return true;
        return false;
    }, false)

}
const deleteUser = async (user) => {

    await User.deleteOne({ "id": user.id })

}
const deleteLink = async (query) => {

    await Link.deleteOne(query);

}

router.post("/app/create", async (req, res) => {

    const appName = req.body.appName;
    const userAccessToken = req.body.userAccessToken;

    // check if request is complete
    const formComplete = isComplete({ userAccessToken, appName });
    if (!formComplete) { res.json(errorMessage.incompleteForm); return; }

    // check if user exists
    const user = await getUser({ token: userAccessToken })
    if (user == undefined) { res.json(errorMessage.userNotFound); return; }

    // create app
    const appToken = await generateToken();
    const id = await generateID();
    const token = [appToken];
    const member = [[user.id, "*"]];

    const app = new App({
        token,
        id,
        member,
        name: appName
    })
    await app.save();

    // send response
    res.json({
        "error": false,
        "message": "App was created successfully!",
        "id": id
    })

})
router.post("/app/token/list", async (req, res) => {

    const userAccessToken = req.body.userAccessToken;
    const appID = req.body.appID;

    // check if request is complete
    const formComplete = isComplete({ userAccessToken, appID });
    if (!formComplete) { res.json(errorMessage.incompleteForm); return; }

    // check if user and app exist
    const user = await getUser({ token: userAccessToken })
    const app = await getApp({ id: appID })
    if (user == undefined) { res.json(errorMessage.userNotFound); return; }
    if (app == undefined) { res.json(errorMessage.appNotFound); return; }

    // check if user has permissions to access app
    const userHasPermissions = hasPermissions(app, user, "*");
    if (!userHasPermissions) { res.json(errorMessage.notEnoughPermissions); return; }

    // send response
    res.json({
        "error": false,
        "message": "Successfully requested all access tokens for the app!",
        "token": app.token
    })

})
router.post("/app/token/create", async (req, res) => {

    const userAccessToken = req.body.userAccessToken;
    const appID = req.body.appID;

    // check if request is complete
    const formComplete = isComplete({ userAccessToken, appID });
    if (!formComplete) { res.json(errorMessage.incompleteForm); return; }

    // check if user and app exist
    const user = await getUser({ token: userAccessToken });
    const app = await getApp({ id: appID });
    if (user == undefined) { res.json(errorMessage.userNotFound); return; }
    if (app == undefined) { res.json(errorMessage.appNotFound); return; }

    // check if user has enough permissions
    const userHasPermissions = hasPermissions(app, user, "*");
    if (!userHasPermissions) { res.json(errorMessage.notEnoughPermissions); return; }

    // create new Token
    const newToken = await generateToken();
    const updatedList = app.token.concat(newToken);
    updateApp({ "id": app.id }, { token: updatedList })

    // send response
    res.json({
        "error": false,
        "message": "Successfully created new token!",
        "token": newToken
    })

})
router.post("/app/token/disable", async (req, res) => {

    const userAccessToken = req.body.userAccessToken;
    const appID = req.body.appID;
    const appToken = req.body.appToken;

    // check if request is complete
    const formComplete = isComplete({ userAccessToken, appID, appToken });
    if (!formComplete) { res.json(errorMessage.incompleteForm); return; }

    // check if user and app exist
    const user = await getUser({ token: userAccessToken });
    const app = await getApp({ id: appID });
    if (user == undefined) { res.json(errorMessage.userNotFound); return; }
    if (app == undefined) { res.json(errorMessage.appNotFound); return; }

    // check if user has enough permissions
    const userHasPermissions = hasPermissions(app, user, "*");
    if (!userHasPermissions) { res.json(errorMessage.notEnoughPermissions); return; }

    // remove token
    const updatedList = app.token.filter((token) => {
        if (token == appToken) return false;
        return true;
    });
    await updateApp({ "id": app.id }, { "token": updatedList })

    // send response
    res.json({
        "error": false,
        "message": "Successfully disabled token!"
    })

})
router.post("/app/member/add", async (req, res) => {

    const userAccessToken = req.body.userAccessToken;
    const appID = req.body.appID;
    const newUserID = req.body.userID;

    // check if request is complete
    const formComplete = isComplete({ userAccessToken, appID, newUserID });
    if (!formComplete) { res.json(errorMessage.incompleteForm); return; }

    // check if user, newUser and app exists
    const user = await getUser({ token: userAccessToken })
    const newUser = await getUser({ id: newUserID })
    const app = await getApp({ id: appID })
    if (user == undefined) { res.json(errorMessage.userNotFound); return; }
    if (newUser == undefined) { res.json(errorMessage.userNotFound); return; }
    if (app == undefined) { res.json(errorMessage.appNotFound); return; }

    // check if user has enough permissions
    const userHasPermissions = hasPermissions(app, user, "*");
    if (!userHasPermissions) { res.json(errorMessage.notEnoughPermissions); return; }

    // check if newUser already is a member
    const isMember = app.member.reduce((acc, cur) => {
        if (acc == true) return true;
        if (cur[0] == newUser.id) return true;
        return false;
    }, false)
    if (isMember) { res.json(errorMessage.userAlreadyMember); return; }

    // add user to app
    const updatedList = app.member.concat([[newUser.id, "*"]]);
    await updateApp({ "id": app.id }, { "member": updatedList })

    // send response
    res.json({
        "error": false,
        "message": "Successfully added user to app!"
    })

})
router.post("/app/member/remove", async (req, res) => {

    const userAccessToken = req.body.userAccessToken;
    const appID = req.body.appID;
    const userID = req.body.userID;

    // check if request is complete
    const formComplete = isComplete({ userAccessToken, appID, userID });
    if (!formComplete) { res.json(errorMessage.incompleteForm); return; }

    // check if user and app exist
    const user = await getUser({ token: userAccessToken });
    const app = await getApp({ id: appID });
    if (user == undefined) { res.json(errorMessage.userNotFound); return; }
    if (app == undefined) { res.json(errorMessage.appNotFound); return; }

    // check if user has enough permissions
    const userHasPermissions = hasPermissions(app, user, "*");
    if (!userHasPermissions) { res.json(errorMessage.notEnoughPermissions); return; }

    // remove token
    const updatedList = app.member.filter((member) => {
        if (member[0] == userID) return false;
        return true;
    });
    console.log(updatedList, app.member)
    await updateApp({ "id": app.id }, { "member": updatedList })

    // send response
    res.json({
        "error": false,
        "message": "Successfully removed user!"
    })

})
router.post("/app/member/list", async (req, res) => {

    const userAccessToken = req.body.userAccessToken;
    const appID = req.body.appID;

    // check if request is complete
    const formComplete = isComplete({ userAccessToken, appID });
    if (!formComplete) { res.json(errorMessage.incompleteForm); return; }

    // check if user and app exist
    const user = await getUser({ token: userAccessToken });
    const app = await getApp({ id: appID });
    if (user == undefined) { res.json(errorMessage.userNotFound); return; }
    if (app == undefined) { res.json(errorMessage.appNotFound); return; }

    // check if user has enough permissions
    const userHasPermissions = hasPermissions(app, user, "*");
    if (!userHasPermissions) { res.json(errorMessage.notEnoughPermissions); return; }

    const extendedMemberList = await Promise.all(app.member.map(async (member) => {
        const user = await getUser({ id: member[0] });
        return user
    }))
    const formattedExtendedMemberList = extendedMemberList.map((member) => { return {id: member.id, name: member.name, email: member.email } })

    // send response
    res.json({
        "error": false,
        "message": "Successfully accessed list of all member!",
        "memberList": app.member,
        "extendedMemberList": formattedExtendedMemberList
    })

})
router.post("/app/user/", async (req, res) => {

    const userAuthToken = req.body.userAuthToken;
    const appToken = req.body.appToken;

    // check if request is complete
    const formComplete = isComplete({ appToken, userAuthToken });
    if (!formComplete) { res.json(errorMessage.incompleteForm); return; }

    // check if user and app exist
    const app = await getApp({ token: appToken });
    if (app == undefined) { res.json(errorMessage.appNotFound); return; }
    console.log(app.id, userAuthToken);
    const user = await getUser({ apps: [app.id, userAuthToken] });
    if (user == undefined) { res.json(errorMessage.userNotFound); return; }

    // check if user has allowed app to access info
    const allowedAccess = await isAddedToApp(user, app);
    if (!allowedAccess) { res.json(errorMessage.userPermittedAccessFromApp); return; }

    // send response
    const data = {
        email: user.email,
        name: user.name
    }
    res.json({
        "error": false,
        "message": "Successfully accessed information of the user!",
        "data": data
    })

})
router.post("/app/info", async (req, res) => {
    
    const appID = req.body.appID;

    // check if request is complete
    const formComplete = isComplete({ appID })
    if (!formComplete) { res.json(errorMessage.incompleteForm); return; }

    // check if user exists
    const app = await getApp({ id: appID })
    if (app == undefined) { res.json(errorMessage.appNotFound); return; }

    // send response
    res.json({
        "error": false,
        "message": "Successfully accessed Info of app!",
        "appID": app.id,
        "appName": app.name
    })

})
router.post("/app/update", async (req, res) => {

    const userAccessToken = req.body.userAccessToken;
    const update = req.body.update;
    const appID = req.body.appID;

    // check if request is complete
    const formComplete = isComplete({ userAccessToken, update })
    if (!formComplete) { res.json(errorMessage.incompleteForm); return; }

    // check if user and app exist
    const user = await getUser({ token: userAccessToken });
    const app = await getApp({ id: appID });
    if (user == undefined) { res.json(errorMessage.userNotFound); return; }
    if (app == undefined) { res.json(errorMessage.appNotFound); return; }

    // check if user has enough permissions
    const userHasPermissions = hasPermissions(app, user, "*");
    if (!userHasPermissions) { res.json(errorMessage.notEnoughPermissions); return; }

    // update propertys
    const keys = Object.keys(update);
    const allowedPropertys = ["name"]
    const allowed = keys.reduce((acc, cur) => {
        if(acc == false) return false;
        if(allowedPropertys.includes(cur)) return true;
        return false;
    }, true)
    if(!allowed) { res.json(errorMessage.notAllowedProperty) }

    const updatedApp = Object.assign(app, update);
    await updateApp({ id: app.id }, updatedApp);

    // send response
    res.json({
        "error": false,
        "message": "Successfully updated properties!"
    })

})

router.post("/user/verify", async (req, res) => {

    const verifyURL = req.body.verificationCode;

    // check if request is complete
    const formComplete = isComplete({ verifyURL });
    if (!formComplete) { res.json(errorMessage.incompleteForm); return; }

    // get link with that verifyURL
    const link = await getLink({ verifyURL })
    console.log(link, verifyURL)
    if (link == null) { res.json(errorMessage.verificationCodeNotValid); return; }

    // convert link to user
    const token = await generateToken();
    const id = await generateID();
    const user = new User({
        apps: [],
        id,
        token,
        email: link.email,
        password: link.password,
        name: link.name
    })
    await user.save();

    // remove link
    await deleteLink({ verifyURL })

    // send response
    res.json({
        "error": false,
        "message": "User was created successfully!",
        "token": token,
        "id": id
    })

})
router.post("/user/create", async (req, res) => {

    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;

    // check if request is complete
    const formComplete = isComplete({ email, password, name });
    if (!formComplete) { res.json(errorMessage.incompleteForm); return; }

    // check if user already exists
    const result = await getUser({ email })
    if (result != null) { res.json(errorMessage.emailAlreadyUsed); return; }

    // check if link already exists
    const result2 = await getLink({ email })
    if (result2 != null) { res.json(errorMessage.emailAlreadyUsed); return; }

    // create Link
    const verifyURL = await generateURL();
    const link = new Link({
        name,
        email,
        password,
        verifyURL
    })
    await link.save();

    sendVerificationMail(email, "localhost:3000/user/verify?code=" + verifyURL);

    // send response
    res.json({
        "error": false,
        "message": "Please verify your account!"
    })

})
router.post("/user/delete", async (req, res) => {

    const email = req.body.email;
    const password = req.body.password;

    // check if request is complete
    const formComplete = isComplete({ email, password });
    if (!formComplete) { res.json(errorMessage.incompleteForm); return; }

    // check if user exists
    const user = await getUser({ email })
    if (user == undefined) { res.json(errorMessage.userNotFound); return; }

    // check if password is valid
    if (user.password != password) { res.json(errorMessage.incorrectPassword); return; }

    // delete user
    await deleteUser(user);

    res.json({
        "error": false,
        "message": "Successfully deleted account!"
    })

})
router.post("/user/token", async (req, res) => {

    const email = req.body.email;
    const password = req.body.password;

    // check if request is complete
    const formComplete = isComplete({ email, password });
    if (!formComplete) { res.json(errorMessage.incompleteForm); return; }

    // check if a link for that user exists
    const link = await getLink({ email })
    if (link != null) { res.json(errorMessage.accountNotVerified); return; }

    // check if user exists
    const user = await getUser({ email })
    if (user == undefined) { res.json(errorMessage.userNotFound); return; }

    // check if password is valid
    if (user.password != password) { res.json(errorMessage.incorrectPassword); return; }

    // generate new token and update user
    const newAccessToken = await generateToken();
    await updateUser({ email, password }, { "token": newAccessToken })

    // send response
    res.json({
        "error": false,
        "message": "New token was generated successfully!",
        "token": newAccessToken,
        "id": user.id
    });

})
router.post("/user/token/auth", async (req, res) => {

    const userAccessToken = req.body.userAccessToken;
    const appID = req.body.appID;

    // check if request is complete
    const formComplete = isComplete({ userAccessToken, appID })
    if (!formComplete) { res.json(errorMessage.incompleteForm); return; }

    // check if user exists
    const user = await getUser({ token: userAccessToken })
    if (user == undefined) { res.json(errorMessage.userNotFound); return; }

    // generate new token and update user
    const newAuthToken = await generateToken();
    const updatedList = user.apps.map((app) => {
        if(app[0] == appID) return [app[0], newAuthToken]
        return app;
    })
    await updateUser({ token: userAccessToken }, { "apps": updatedList })

    // send response
    res.json({
        "error": false,
        "message": "Successfully generated new authToken for selected app!",
        "authToken": newAuthToken
    })

})
router.post("/user/app/add", async (req, res) => {

    const userAccessToken = req.body.userAccessToken;
    const appID = req.body.appID;

    // check if request is complete
    const formComplete = isComplete({ userAccessToken, appID })
    if (!formComplete) { res.json(errorMessage.incompleteForm); return; }

    // check if user and app exist
    const user = await getUser({ token: userAccessToken })
    const app = await getApp({ id: appID })
    if (user == undefined) { res.json(errorMessage.userNotFound); return; }
    if (app == undefined) { res.json(errorMessage.appNotFound); return; }

    // check if user has been already added to the app
    const isAlreadyAdded = user.apps.reduce((acc, value) => {
        if (acc == true) return true;
        if (value[0] == appID) return true;
        return false;
    }, false)
    if (isAlreadyAdded) {

        const authToken = user.apps.reduce((acc, value) => {
            if(acc[0] == appID) return acc;
            return value;
        }, [null, null])[1];
        // send response
        res.json({
            "error": false,
            "message": "User was already added to the app!",
            "userID": user.id,
            "authToken": authToken
        })

        return;
    }

    // add user to app
    const authToken = await generateToken();
    const updatedList = user.apps.concat([[app.id, authToken]]);
    await updateUser({ token: userAccessToken }, { apps: updatedList })

    // send response
    res.json({
        "error": false,
        "message": "User was added to the app successfully!",
        "userID": user.id,
        "authToken": authToken
    })

})
router.post("/user/app/remove", async (req, res) => {

    const userAccessToken = req.body.userAccessToken;
    const appID = req.body.appID;

    // check if request is complete
    const formComplete = isComplete({ userAccessToken, appID })
    if (!formComplete) { res.json(errorMessage.incompleteForm); return; }

    // check if user and app exist
    const user = await getUser({ token: userAccessToken })
    const app = await getApp({ id: appID })
    if (user == undefined) { res.json(errorMessage.userNotFound); return; }
    if (app == undefined) { res.json(errorMessage.appNotFound); return; }

    // check if user has already been removed from the app
    const isAlreadyAdded = await isAddedToApp(user, app);
    if (!isAlreadyAdded) { res.json(errorMessage.userAlreadyRemoved); return; }

    // remove user from app
    const updatedList = user.apps.filter((app) => {
        if (app[0] == appID) return false;
        return true;
    });
    await updateUser({ token: userAccessToken }, { apps: updatedList })

    // send response
    res.json({
        "error": false,
        "message": "User was successfully removed from the app!"
    })

})
router.post("/user/id", async (req, res) => {

    const userAccessToken = req.body.userAccessToken;

    // check if request is complete
    const formComplete = isComplete({ userAccessToken })
    if (!formComplete) { res.json(errorMessage.incompleteForm); return; }

    // check if user exists
    const user = await getUser({ token: userAccessToken })
    if (user == undefined) { res.json(errorMessage.userNotFound); return; }

    // send response
    res.json({
        "error": false,
        "message": "Successfully accessed ID from the user!",
        "userID": user.id
    })

})
router.post("/user/info", async (req, res) => {

    const userAccessToken = req.body.userAccessToken;

    // check if request is complete
    const formComplete = isComplete({ userAccessToken })
    if (!formComplete) { res.json(errorMessage.incompleteForm); return; }

    // check if user exists
    const user = await getUser({ token: userAccessToken })
    if (user == undefined) { res.json(errorMessage.userNotFound); return; }

    // get apps the user is member of
    const result = await getApp({ member: [user.id, "*"] })
    const memberApps = result ? result : []
    const userAppsMember = (Array.isArray((memberApps)) ? memberApps : [memberApps]).map((app) => { return { "name": app.name, "id": app.id } })

    const apps = user.apps.map((app) => app[0])

    // send response
    res.json({
        "error": false,
        "message": "Successfully accessed Info of user!",
        "user": {
            "id": user.id,
            "email": user.email,
            "name": user.name,
            "apps": apps,
            "appsMember": userAppsMember
        }
    })

})
router.post("/user/update", async (req, res) => {

    const userAccessToken = req.body.userAccessToken;
    const update = req.body.update;

    // check if request is complete
    const formComplete = isComplete({ userAccessToken, update })
    if (!formComplete) { res.json(errorMessage.incompleteForm); return; }

    // check if user exists
    const user = await getUser({ token: userAccessToken })
    if (user == undefined) { res.json(errorMessage.userNotFound); return; }

    // update propertys
    const keys = Object.keys(update);
    const allowedPropertys = ["email", "name"]
    const allowed = keys.reduce((acc, cur) => {
        if(acc == false) return false;
        if(allowedPropertys.includes(cur)) return true;
        return false;
    }, true)
    if(!allowed) { res.json(errorMessage.notAllowedProperty) }

    const updatedUser = Object.assign(user, update);
    await updateUser({ id: user.id }, updatedUser);

    res.json({
        "error": false,
        "message": "Updated propertys successfully!"
    })

})
router.post("/user/password", async (req, res) => {

    const userID = req.body.userID;
    const password = req.body.password;
    const newPassword = req.body.newPassword;

    // check if request is complete
    const formComplete = isComplete({ userID, password, newPassword })
    if (!formComplete) { res.json(errorMessage.incompleteForm); return; }

    // check if user exists
    const user = await getUser({ id: userID })
    if (user == undefined) { res.json(errorMessage.userNotFound); return; }

    // check if password is valid
    if (user.password != password) { res.json(errorMessage.incorrectPassword); return; }

    // update User
    const updatedUser = Object.assign(user, { password: newPassword })
    await updateUser({ id: user.id }, updatedUser)

    res.json({
        "error": false,
        "message": "Updated password successfully!"
    })

})

module.exports = router;