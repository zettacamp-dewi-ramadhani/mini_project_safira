const User = require("./user.model");
const jwt = require("jsonwebtoken");
const tokenSecret = "secretZettaCamp";
const bcrypt = require("bcrypt");

const signUp = async (parent, { input }) => {
  try {
    if (!input) {
      throw new Error("No data to input");
    } else {
      const { email, password, first_name, last_name, role } = input;
      const encryptedPass = await bcrypt.hash(password, 10);

      let generalPermit = [
        {
          name: "Menu",
          view: true
        },
        {
          name: "About",
          view: true
        },
        {
          name: "Cart",
          view: false
        },
        {
          name: "Login",
          view: false
        }
      ];

      let usertype = [];
      if (role === "admin") {
        usertype.push(
          ...generalPermit,
          {
            name: "Menu Management",
            view: true
          },
          {
            name: "Stock Management",
            view: true
          }
        );

        let user = new User({
          email: email,
          password: encryptedPass,
          first_name: first_name,
          last_name: last_name,
          user_type: usertype
        });

        await user.save();
        return user;
      } else if (role === "user") {
        usertype.push(
          ...generalPermit,
          {
            name: "Menu Management",
            view: false
          },
          {
            name: "Stock Management",
            view: false
          }
        );

        let user = new User({
          email: email,
          password: encryptedPass,
          first_name: first_name,
          last_name: last_name,
          user_type: usertype,
          wallet: 50000
        });

        await user.save();
        return user;
      }
    }
  } catch (err) {
    throw new Error("Sign Up Error");
  }
};

const login = async (parent, { input: { email, password } }) => {
  let user = await User.findOne({
    email: email
  });

  if (user == null) {
    throw new Error("User not found");
  } else {
    const decryptedPass = await bcrypt.compare(password, user.password);
    if (user.status === "deleted") {
      throw new Error("Login Error");
    } else if (user && decryptedPass) {
      const token = jwt.sign(
        {
          id: user._id
        },
        tokenSecret,
        {
          expiresIn: "12h"
        }
      );
      return {
        token,
        user: {
          _id: user._id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          user_type: user.user_type
        }
      };
    } else {
      throw new Error("User not found");
    }
  }
};

const getAllUsers = async (parent, { filter, paging }) => {
  let aggregateQuery = [];
  let matchQuerry = {
    $and: [
      {
        status: "active"
      }
    ]
  };

  if (filter) {
    if (filter.email) {
      const search = new RegExp(filter.email, "i");
      matchQuerry.$and.push({
        email: search
      });
    }

    if (filter.first_name) {
      const search = new RegExp(filter.first_name, "i");
      matchQuerry.$and.push({
        first_name: search
      });
    }

    if (filter.last_name) {
      const search = new RegExp(filter.last_name, "i");
      matchQuerry.$and.push({
        last_name: search
      });
    }
  }
  let totalCount = await User.count();
  if (matchQuerry.$and.length) {
    aggregateQuery.push({
      $match: matchQuerry
    });
    let updateCount = await User.aggregate(aggregateQuery);
    totalCount = updateCount.length;
  }

  if (paging) {
    const { limit, page } = paging;
    aggregateQuery.push(
      {
        $match: {
          status: "active"
        }
      },
      {
        $skip: page * limit
      },
      {
        $limit: limit
      }
    );
  }

  if (!aggregateQuery.length) {
    let result = await User.find().lean();
    result = result.map(el => {
      return {
        ...el,
        count: result.length,
        total_count: totalCount
      };
    });
    return result;
  }

  let result = await User.aggregate(aggregateQuery);
  result = result.map(el => {
    return {
      ...el,
      count: result.length,
      total_count: totalCount
    };
  });
  return result;
};

const getOneUser = async (parent, { filter }) => {
  const { id, email } = filter;
  if (!id) {
    let result = await User.findOne({
      email: email
    });
    return result;
  } else if (!email) {
    let result = await User.findOne({
      _id: id
    });
    return result;
  } else {
    let result = await User.findOne({
      _id: id,
      email: email
    });
    return result;
  }
};

const updateUser = async (parent, { input }, ctx) => {
  if (!input) {
    throw new Error("No data to update");
  } else {
    const { newEmail, newPassword, newFirst_name, newLast_name } = input;
    const userId = ctx.user[0]._id;
    const encryptedPass = await bcrypt.hash(newPassword, 10);
    let data = await User.findByIdAndUpdate(
      userId,
      {
        email: newEmail,
        password: encryptedPass,
        first_name: newFirst_name,
        last_name: newLast_name
      },
      {
        new: true
      }
    );
    return data;
  }
};

const deleteUser = async (parent, { input }, ctx) => {
  if (!input) {
    throw new Error("Nothing to update");
  } else {
    const { id } = input;
    let result = await User.findByIdAndUpdate(
      {
        _id: id
      },
      {
        $set: {
          status: "deleted"
        }
      },
      {
        new: true
      }
    );
    return result;
  }
};

const forgetPass = async (parent, { input }, ctx) => {
  if (!input) {
    throw new Error("No data input");
  } else {
    const { email, password } = input;
    const validate = await User.findOne({
      email: email
    });

    if (validate == null) {
      throw new Error("User not found, please register first");
    } else if (validate.status == "deleted") {
      throw new Error("Your account is already deleted. Please register again");
    } else {
      const encryptedPass = await bcrypt.hash(password, 10);
      const reset = await User.findByIdAndUpdate(
        {
          _id: validate._id
        },
        {
          $set: {
            password: encryptedPass
          }
        },
        {
          new: true
        }
      );
      return reset;
    }
  }
};

const UserResolvers = {
  Query: {
    getAllUsers,
    getOneUser
  },

  Mutation: {
    signUp,
    login,
    updateUser,
    deleteUser,
    forgetPass
  }
};

module.exports = { UserResolvers };