const errorCode = {
    "1": "Request data is not valid!",
    "2": "Request data is incomplete!",
    "3": "Email is already in use!",
    "4": "There is an error with your account. Please consult the support!",
    "5": "The user couldn't be found!",
    "6": "The password for the user is incorrect!",
    "7": "The app couldn't be found!",
    "8": "You don't have enough permissions to perform this action!",
    "9": "User was already added to the app!",
    "10": "User is already a member of the app!",
    "11": "User has already been removed from the app!",
    "12": "User hasn't allowed app to access their information!",
    "13": "You're not allowed to update this property!",
    "14": "Failed to match verification Code with user!",
    "15": "You need to verify your account first!"
}
const errorTemplate = (code) => {
    return {
        "error": {
            code,
            message: errorCode[code]
        }
    }
}
const errorMessage = {
    "incompleteForm": errorTemplate(2),
    "emailAlreadyUsed": errorTemplate(3),
    "multipleAccounts": errorTemplate(4),
    "userNotFound": errorTemplate(5),
    "incorrectPassword": errorTemplate(6),
    "appNotFound": errorTemplate(7),
    "notEnoughPermissions": errorTemplate(8),
    "userAlreadyAdded": errorTemplate(9),
    "userAlreadyMember": errorTemplate(10),
    "userAlreadyRemoved": errorTemplate(11),
    "userPermittedAccessFromApp": errorTemplate(12),
    "notAllowedProperty": errorTemplate(13),
    "verificationCodeNotValid": errorTemplate(14),
    "accountNotVerified": errorTemplate(15)
}

module.exports = {
    errorMessage
}