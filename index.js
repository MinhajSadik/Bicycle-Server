const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;

const app = express();

app.use(bodyParser.json());
app.use(cors());
require("dotenv").config();

const port = 3003;

app.get("/", (req, res) => {
	res.send("Hello I am Working Now");
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.3xxwt.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});
client.connect((err) => {
	const ServicesCollection = client
		.db("Bicycle_Master")
		.collection("services");
	const ReviewsCollection = client
		.db("Bicycle_Master")
		.collection("reviews");
	const BookingCollection = client
		.db("Bicycle_Master")
		.collection("booking");
	const AdminCollection = client.db("Bicycle_Master").collection("admin");
	const GalleryCollection = client
		.db("Bicycle_Master")
		.collection("gallery");
	// perform actions on the collection object
	console.log("database Connected");
	// post services:
	app.post("/service", (req, res) => {
		const service = req.body;
		console.log(service);
		ServicesCollection.insertOne(service).then((result) => {
			res.send(result.insertedCount > 0);
		});
	});

	// Get services:
	app.get("/services", (req, res) => {
		ServicesCollection.find({}).toArray((err, documents) => {
			// console.log(documents);
			res.send(documents);
		});
	});

	//Get service from Services by id:
	app.get("/service/:id", (req, res) => {
		const id = ObjectId(req.params.id);
		console.log(id);
		ServicesCollection.find({
			_id: ObjectId(`${req.params.id}`),
		}).toArray((err, documents) => {
			console.log(documents);
			res.send(documents);
		});
	});

	// Delete Service:
	app.delete("/deleteService/:id", (req, res) => {
		const id = ObjectId(req.params.id);
		ServicesCollection.deleteOne({
			_id: ObjectId(`${req.params.id}`),
		}).then((result) => {
			// console.log(result);
		});
	});
	// Post Review:
	app.post("/review", (req, res) => {
		const review = req.body;

		console.log(review);
		ReviewsCollection.insertOne(review).then((result) => {
			res.send(result.insertedCount > 0);
		});
	});

	// Get reviews:

	app.get("/reviews", (req, res) => {
		ReviewsCollection.find({}).toArray((err, documents) => {
			console.log(documents);
			res.send(documents);
		});
	});

	// Post Book Now:

	app.post("/bookNow", (req, res) => {
		const bookNow = req.body;

		console.log(bookNow);
		BookingCollection.insertOne(bookNow).then((result) => {
			res.send(result.insertedCount > 0);
		});
	});

	// Get All Booking List:
	app.get("/allBookingList", (req, res) => {
		BookingCollection.find({}).toArray((err, documents) => {
			console.log(documents);
			res.send(documents);
		});
	});

	// Get Current User Booking List :
	app.get("/bookingList/:email", (req, res) => {
		BookingCollection.find({ email: req.params.email }).toArray(
			(err, documents) => {
				console.log(documents);
				res.send(documents);
			}
		);
	});

	// change Booking Status:
	app.patch("/updateStatus/:id", (req, res) => {
		BookingCollection.updateOne(
			{ _id: ObjectId(req.params.id) },
			{
				$set: {
					status: req.body.status,
				},
			}
		).then((result) => {
			res.send(result.modifiedCount !== 0);
		});
	});

	// post new Admin:

	app.post("/newAdmin", (req, res) => {
		const newAdmin = req.body;

		console.log(newAdmin);
		AdminCollection.insertOne(newAdmin).then((result) => {
			res.send(result.insertedCount > 0);
		});
	});

	// Get All Admin:
	app.get("/allAdmin", (req, res) => {
		AdminCollection.find({}).toArray((err, documents) => {
			console.log(documents);
			res.send(documents);
		});
	});

	// post new Gallery Image:

	app.post("/gallery", (req, res) => {
		const gallery = req.body;

		console.log(gallery);
		GalleryCollection.insertOne(gallery).then((result) => {
			res.send(result.insertedCount > 0);
		});
	});

	// Get All Admin:
	app.get("/AllGalleryData", (req, res) => {
		GalleryCollection.find({}).toArray((err, documents) => {
			console.log(documents);
			res.send(documents);
		});
	});
});

app.listen(process.env.PORT || port);
