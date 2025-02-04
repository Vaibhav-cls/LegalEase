const Provider = require("../models/provider");
const User = require("../models/user");
const Tag = require("../models/tag");
const Appointment = require("../models/appointment");

module.exports.renderDashboard = async (req, res) => {
  const { id } = req.params;
  const userInfo = await User.findOne({ _id: id });
  const userId = userInfo._id.toString();
  const providerInfo = await Provider.findOne({ user: userId })
    .populate("tags")
    .populate({
      path: "reviews",
      populate: {
        path: "author",
        model: "Client",
        populate: {
          path: "user",
          model: "User",
        },
      },
    });
  const providerId = providerInfo._id.toString();
  const clientId = req.session.clientId;
  req.session.providerId = providerId;
  const appointments = await Appointment.find({
    providerId: providerId,
  }).populate({
    path: "clientId",
    populate: {
      path: "user",
      model: "User",
    },
  });
  console.log(appointments, "\n");
  res.render("providers/dashboard.ejs", {
    provider: providerInfo,
    user: userInfo,
    clientId,
    appointment: appointments,
  });
};

module.exports.renderProviderEditForm = async (req, res) => {
  const { id } = req.params;
  const providerDetails = await Provider.findOne({ _id: id }).populate("tags");
  const userId = providerDetails.user.toString();
  const userDetails = await User.findOne({ _id: userId });
  const allTags = await Tag.find();
  res.render("providers/edit.ejs", {
    provider: providerDetails,
    user: userDetails,
    allTags,
  });
};

module.exports.editProvider = async (req, res) => {
  try {
    const { id } = req.params;
    const newValues = req.body;
    let { tags } = newValues;

    try {
      tags = JSON.parse(tags);
    } catch (error) {
      return res.status(400).send("Invalid tags format");
    }

    const providerDetails = await Provider.findOne({ _id: id }).populate(
      "tags"
    );
    if (!providerDetails) {
      return res.status(404).send("Provider not found");
    }

    const oldTags = providerDetails.tags;
    const removedTags = oldTags.filter((item) => !tags.includes(item.name));
    const tagIds = [];

    // Update new tags
    for (let tag of tags) {
      let tagData = await Tag.findOne({ name: tag });
      if (!tagData) {
        tagData = new Tag({ name: tag, providers: [id] });
        await tagData.save();
      } else {
        if (!tagData.providers.includes(id)) {
          tagData.providers.push(id);
          await tagData.save();
        }
      }
      tagIds.push(tagData._id);
    }

    // Handle removed tags
    for (let tag of removedTags) {
      let tagData = await Tag.findOne({ name: tag.name });
      if (tagData) {
        tagData.providers = tagData.providers.filter(
          (item) => item.toString() != id
        );
        await tagData.save();
      }
    }

    newValues.tags = tagIds;
    const updatedData = await Provider.findByIdAndUpdate(id, newValues, {
      new: true,
    });

    res.redirect(`/provider/dashboard/${providerDetails.user.toString()}`);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while updating provider details");
  }
};
