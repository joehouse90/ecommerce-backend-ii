import { UserModel } from "../../models/user.model.js";

export class UsersDAO {
  getByEmail = (email) => {
    return UserModel.findOne({ email });
  };

  getById = (id) => {
    return UserModel.findById(id);
  };

  getAll = () => {
    return UserModel.find();
  };

  create = (data) => {
    return UserModel.create(data);
  };

  update = (id, data) => {
    return UserModel.findByIdAndUpdate(id, data, { new: true });
  };

  delete = (id) => {
    return UserModel.findByIdAndDelete(id);
  };
  setResetToken = (email, token, expire) => {
  return UserModel.findOneAndUpdate(
    { email },
    { resetToken: token, resetTokenExpire: expire },
    { new: true }
  );
};

getByResetToken = (token) => {
  return UserModel.findOne({ resetToken: token });
};

}