class UserDto {
    _id;
    username;
    email;

    constructor(model) {
        this._id = model._id;
        this.username = model.username;
        this.email = model.email;
    };
};

module.exports = UserDto;