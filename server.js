// ==============================================================
// DEPENDENCIES
// ==============================================================
const Express = require("express");
const BodyParser = require("body-parser");
const Exphbs = require("express-handlebars");

let app = Express();
let PORT = process.env.PORT || 8080;

// require models
const DB = require("./models");

// Parse application/x-www-form-urlencoded
app.use(BodyParser.urlencoded({ extended: false }));

// Serve static content for the app from the "public" directory in 
// the application directory.
app.use(Express.static("public"));

// Setup Handlebars
app.engine("handlebars", Exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// connect routes
require("./routes/api-routes-races")(app);

// sync the database and start server listening
DB.sequelize.sync().then(() => {
	app.listen(PORT, () => {
		console.log("Server listening on: http://localhost:%s", PORT);
	});
})
