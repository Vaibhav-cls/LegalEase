module.exports.dashboard = (user) => {
    if (user.user_type === "provider") {
        return `/provider/dashboard/${user._id}`;
    } else if (user.user_type === "client") {
        return `/client/dashboard/${user._id}`;
    } else {
        return "/admin/dashboard";
    }
};