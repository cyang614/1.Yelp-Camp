const mongoose = require("mongoose");
const cities = require("./citites");
const { places, descriptors } = require("./seedHelpers");
const Campground = require(".././models/campground");
mongoose.connect(
  "mongodb://mongo:9FLfIscYOihxbo2ebEBP@containers-us-west-123.railway.app:7522"
);

mongoose.connection.on(
  "error",
  console.error.bind(console, "connection error:")
);
mongoose.connection.once("open", () => {
  console.log("Database connected");
});

const sample = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 200; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new Campground({
      author: "645e4ada17937419b14f0782",
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      description:
        "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Repellendus, omnis voluptatibus suscipit explicabo alias provident perspiciatis! Nesciunt molestias voluptatem sit, vitae nulla a impedit neque, quam dolorum quos recusandae nostrum?",
      price: `${price}`,
      geometry: {
        type: "Point",
        coordinates: [
          cities[random1000].longitude,
          cities[random1000].latitude,
        ],
      },
      image: [
        {
          url: "https://res.cloudinary.com/dsyjt6sjn/image/upload/v1684134168/YelpCamp/ke5jslqqeyyf3ua4mg5a.jpg",
          filename: "YelpCamp/dfqlsmt1tidodrfdthos",
        },
        {
          url: "https://res.cloudinary.com/dsyjt6sjn/image/upload/v1684126655/YelpCamp/qcx2i4exafbadbylrmot.jpg",
          filename: "YelpCamp/qcx2i4exafbadbylrmot",
        },
      ],
    });
    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
