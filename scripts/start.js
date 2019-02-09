process.env.NODE_ENV = "development";

// Load environment variables from .env file. Suppress warnings using silent
// if this file is missing. dotenv will never modify any environment variables
// that have already been set.
// https://github.com/motdotla/dotenv
require("dotenv").config({ silent: true });

var chalk = require("chalk");
var webpack = require("webpack");
var WebpackDevServer = require("webpack-dev-server");
var historyApiFallback = require("connect-history-api-fallback");
var httpProxyMiddleware = require("http-proxy-middleware");
var detect = require("detect-port");
var clearConsole = require("react-dev-utils/clearConsole");
var checkRequiredFiles = require("react-dev-utils/checkRequiredFiles");
var formatWebpackMessages = require("react-dev-utils/formatWebpackMessages");
var getProcessForPort = require("react-dev-utils/getProcessForPort");
var openBrowser = require("react-dev-utils/openBrowser");
var prompt = require("react-dev-utils/prompt");
var pathExists = require("path-exists");
var config = require("../config/webpack.config.dev");
var paths = require("../config/paths");

var useYarn = pathExists.sync(paths.yarnLockFile);
var cli = useYarn ? "yarn" : "npm";
var isInteractive = process.stdout.isTTY;

//var cors = require('cors')

var fs = require("fs");
var https = require("https");
// Warn and crash if required files are missing
if (!checkRequiredFiles([paths.appHtml, paths.appIndexJs])) {
  process.exit(1);
}

var Web3 = require("web3");

///////////////////////////////////////

var express = require("express");
var path = require("path");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var router = express.Router();
var app = express();
//app.use(cors())
// mongoose.connect('mongodb://localhost/TADDB',()=>{console.log("mongoDB connected")});
mongoose.connect(
  "mongodb://admin:admin123!@ds121135.mlab.com:21135/taddb",
  () => {
    console.log("mongoDB connected");
  }
);
// mongoose.connect('mongodb://localhost:53791/');

var governorSchema = require("./models/governors").governorSchema;
var userSchema = require("./models/servers").userSchema;
var itemSchema = require("./models/items").itemSchema;
var auctionSchema = require("./models/auction").auctionSchema;

const crypto = require("crypto");
//const hash = crypto.createHash('sha256');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

function generateUID() {
  var firstPart = (Math.random() * 46656) | 0;
  var secondPart = (Math.random() * 46656) | 0;
  firstPart = ("000" + firstPart.toString(36)).slice(-3);
  secondPart = ("000" + secondPart.toString(36)).slice(-3);
  return firstPart + secondPart;
}

function clamp(num, min, max) {
  return num <= min ? min : num >= max ? max : num;
}

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE");
  res.header("Access-Control-Expose-Headers", "Authorization");
  next();
});

function compare(a, b) {
  if (a.playerCount < b.playerCount) return -1;
  if (a.playerCount > b.playerCount) return 1;
  return 0;
}

/*
You still need:
verifyPayment()
buyTicket()
payoutLottery()


*/

function setGovernors() {
  var Server = mongoose.model("Governors", governorSchema);
  var states = [
    "Alabama",
    "Alaska",
    "Arizona",
    "Arkansas",
    "California",
    "Colorado",
    "Connecticut",
    "Delaware",
    "Florida",
    "Georgia",
    "Hawaii",
    "Idaho",
    "Illinois",
    "Indiana",
    "Iowa",
    "Kansas",
    "Kentucky",
    "Louisiana",
    "Maine",
    "Maryland",
    "Massachusetts",
    "Michigan",
    "Minnesota",
    "Mississippi",
    "Missouri",
    "Montana",
    "Nebraska",
    "Nevada",
    "New Hampshire",
    "New Jersey",
    "New Mexico",
    "New York",
    "North Carolina",
    "North Dakota",
    "Ohio",
    "Oklahoma",
    "Oregon",
    "Pennsylvania",
    "Rhode Island",
    "South Carolina",
    "South Dakota",
    "Tennessee",
    "Texas",
    "Utah",
    "Vermont",
    "Virginia",
    "Washington",
    "West Virginia",
    "Wisconsin",
    "Wyoming"
  ];
  Server.find({}, function(err, products) {
    if (products) {
      for (var x = 0; x < products.length; x++) {
        products[x].state = states[x];
      }
    } else {
      for (var x = 0; x < 50; x++) {
        var gov = new Server({
          state: states[x],
          name: "No Player",
          coinbase: "0x00000000..."
        });
        gov.save();
      }
    }
  });
}

app.post("/register", function(req, res) {
  var User = mongoose.model("Users", userSchema);
  User.findOne({ coinbase: req.body.cb }, async function(err, products) {
    if (products == "undefined" || products == null) {
      var ref = generateUID();
      var nUser = new User({
        name: req.body.name,
        coinbase: req.body.cb,
        inventory: [],
        balance: 0,
        gid: ref,
        session: ref,
        rating: 0,
        reviews: 0,
        password: req.body.password
      });
      await nUser.save();
      return res.send(ref);
    } else return res.send("User Already Exists");
  });
});

app.post("/login", function(req, res) {
  var User = mongoose.model("Users", userSchema);
  User.findOne({ name: req.body.name }, async function(err, products) {
    if (products != null && req.body.password == products.password) {
      //var ref = generateUID();
      products.session = generateUID();
      await products.save();
      return res.send(products.session);
    } else return res.send("No USER Found");
  });
});

app.post("/createItem", function(req, res) {
  var Item = mongoose.model("Items", itemSchema);
  
  Item.findOne({ name: req.body.name }, async function(err, products) {
    if (products == "undefined" || products == null) {
      //var ref = generateUID();
      var nUser = new Item({
        name: req.body.name,
        category: req.body.category,
        price: req.body.price
      });
      await nUser.save();
    } else {
      products.price = req.body.price;
      await products.save();
    }

    Item.find({}, function(err, it) {
      return res.send(it);
    });
  });
});

app.post("/purchaseItem", function(req, res) {
  var User = mongoose.model("Users", userSchema);
  var Item = mongoose.model("Items", itemSchema);
  Item.findOne({ name: req.body.itemName }, function(err, it) {
    User.findOne({ name: req.body.name }, async function(err, products) {
      if (
        products != null &&
        req.body.session == products.session &&
        it.price <= products.balance
      ) {
        //var ref = generateUID();
        products.balance -= it.price;
        products.inventory.push(it);
        await products.save();
        return res.send("User Added");
      } else return res.send("User Already Exists");
    });
  });
});

app.get("/getItems", function(req, res) {
  var Item = mongoose.model("Items", itemSchema);
  Item.find({}, function(err, it) {
    return res.send(it);
  });
});

app.post("/postAuction", function(req, res) {
  var Auction = mongoose.model("Auction", auctionSchema);
  var User = mongoose.model("Users", userSchema);
  User.findOne({ name: req.body.name }, async function(err, usr) {
    if (
      usr != null &&
      usr.session == req.body.session &&
      usr.inventory.indexOf(req.body.itemName) != -1
    ) {
      var auc = new Auction({
        name: req.body.itemName,
        startBid: req.body.price,
        price: req.body.price,
        expiry: req.body.expiry,
        owner: req.body.name,
        bidOwner: null
      });
      await auc.save();

      return res.send("Auction Added");
    } else {
      return res.send("Verification Failed");
    }
  });
});

app.post("/bidAuction", function(req, res) {
  var Auction = mongoose.model("Auction", auctionSchema);
  var User = mongoose.model("Users", userSchema);
  Auction.findOne({ id: req.body.auctionId }, function(err, product) {
    if (product != null)
      User.findOne({ name: req.body.name }, async function(err, usr) {
        if (
          usr != null &&
          usr.session == req.body.session &&
          usr.balance >= req.body.bid &&
          product.price < req.body.bid
        ) {
          product.price = req.body.bid;
          product.bidOwner = usr.name;
          await product.save();

          return res.send("Auction Added");
        } else {
          return res.send("Verification Failed");
        }
      });
  });
});

app.get("/getAuction", function(req, res) {
  var Auction = mongoose.model("Auction", auctionSchema);
  Auction.find({}, function(err, it) {
    return res.send(it);
  });
});

app.post("/test", function(req, res) {
  console.log("FAJO");
  fs.readFile("currencyTable.json", "utf8", function readFileCallback(
    err,
    data
  ) {
    if (err) {
      console.log(err);
    } else {
      var obj = JSON.parse(data); //now it an object
      return res.send(obj.table);
    }
  });
});

app.post("/getNumbers", function(req, res) {
  console.log("FAJO");
  fs.readFile("winningNumbers.json", "utf8", function readFileCallback(
    err,
    data
  ) {
    if (err) {
      console.log(err);
    } else {
      var obj = JSON.parse(data); //now it an object
      return res.send(obj.table);
    }
  });
});

app.post("/setNumbers", function(req, res) {
  fs.readFile("winningNumbers.json", "utf8", function readFileCallback(
    err,
    data
  ) {
    if (err) {
      console.log(err);
    } else {
      console.log(req.body.numbers);
      var obj = JSON.parse(data); //now it an object
      obj.table = req.body.numbers;
      var json = JSON.stringify(obj);
      fs.writeFile(
        "winningNumbers.json",
        json,
        "utf8",
        function writeFileCallBack(err, data) {
          if (err) {
            console.log(err);
          } else {
            return res.send(obj.table);
          }
        }
      );
      // return res.send(obj.table)
    }
  });
});

app.post("/test2", function(req, res) {
  console.log("FAJO");
  fs.readFile("currencyTable.json", "utf8", function readFileCallback(
    err,
    data
  ) {
    if (err) {
      console.log(err);
    } else {
      var obj = JSON.parse(data); //now it an object
      console.log(req.body.currency);
      console.log(obj.table.findIndex(i => i.currency == req.body.currency));
      obj.table[
        obj.table.findIndex(i => i.currency == req.body.currency)
      ].price = req.body.price;
      var json = JSON.stringify(obj);
      fs.writeFile(
        "currencyTable.json",
        json,
        "utf8",
        function writeFileCallBack(err, data) {
          if (err) {
            console.log(err);
          } else {
            return res.send(obj.table);
          }
        }
      );
    }
  });
});

app.use("/api", require("./routes/api"));

app.listen(5001);
var server = https.createServer(app);
//server.listen(5001);
console.log("API Running On Port 5001");

// Tools like Cloud9 rely on this.
var DEFAULT_PORT = process.env.PORT || 3000;
var compiler;
var handleCompile;

// You can safely remove this after ejecting.
// We only use this block for testing of Create React App itself:
var isSmokeTest = process.argv.some(arg => arg.indexOf("--smoke-test") > -1);
if (isSmokeTest) {
  handleCompile = function(err, stats) {
    if (err || stats.hasErrors() || stats.hasWarnings()) {
      process.exit(1);
    } else {
      process.exit(0);
    }
  };
}

function setupCompiler(host, port, protocol) {
  // "Compiler" is a low-level interface to Webpack.
  // It lets us listen to some events and provide our own custom messages.
  compiler = webpack(config, handleCompile);

  // "invalid" event fires when you have changed a file, and Webpack is
  // recompiling a bundle. WebpackDevServer takes care to pause serving the
  // bundle, so if you refresh, it'll wait instead of serving the old one.
  // "invalid" is short for "bundle invalidated", it doesn't imply any errors.
  compiler.plugin("invalid", function() {
    if (isInteractive) {
      clearConsole();
    }
    console.log("Compiling...");
  });

  var isFirstCompile = true;

  // "done" event fires when Webpack has finished recompiling the bundle.
  // Whether or not you have warnings or errors, you will get this event.
  compiler.plugin("done", function(stats) {
    if (isInteractive) {
      clearConsole();
    }

    // We have switched off the default Webpack output in WebpackDevServer
    // options so we are going to "massage" the warnings and errors and present
    // them in a readable focused way.
    var messages = formatWebpackMessages(stats.toJson({}, true));
    var isSuccessful = !messages.errors.length && !messages.warnings.length;
    var showInstructions = isSuccessful && (isInteractive || isFirstCompile);

    if (isSuccessful) {
      console.log(chalk.green("Compiled successfully!"));
    }

    if (showInstructions) {
      console.log();
      console.log("The app is running at:");
      console.log();
      console.log(
        "  " + chalk.cyan(protocol + "://" + host + ":" + port + "/")
      );
      console.log();
      console.log("Note that the development build is not optimized.");
      console.log(
        "To create a production build, use " +
          chalk.cyan(cli + " run build") +
          "."
      );
      console.log();
      isFirstCompile = false;
    }

    // If errors exist, only show errors.
    if (messages.errors.length) {
      console.log(chalk.red("Failed to compile."));
      console.log();
      messages.errors.forEach(message => {
        console.log(message);
        console.log();
      });
      return;
    }

    // Show warnings if no errors were found.
    if (messages.warnings.length) {
      console.log(chalk.yellow("Compiled with warnings."));
      console.log();
      messages.warnings.forEach(message => {
        console.log(message);
        console.log();
      });
      // Teach some ESLint tricks.
      console.log("You may use special comments to disable some warnings.");
      console.log(
        "Use " +
          chalk.yellow("// eslint-disable-next-line") +
          " to ignore the next line."
      );
      console.log(
        "Use " +
          chalk.yellow("/* eslint-disable */") +
          " to ignore all warnings in a file."
      );
    }
  });
}

// We need to provide a custom onError function for httpProxyMiddleware.
// It allows us to log custom error messages on the console.
function onProxyError(proxy) {
  return function(err, req, res) {
    var host = req.headers && req.headers.host;
    console.log(
      chalk.red("Proxy error:") +
        " Could not proxy request " +
        chalk.cyan(req.url) +
        " from " +
        chalk.cyan(host) +
        " to " +
        chalk.cyan(proxy) +
        "."
    );
    console.log(
      "See https://nodejs.org/api/errors.html#errors_common_system_errors for more information (" +
        chalk.cyan(err.code) +
        ")."
    );
    console.log();

    // And immediately send the proper error response to the client.
    // Otherwise, the request will eventually timeout with ERR_EMPTY_RESPONSE on the client side.
    if (res.writeHead && !res.headersSent) {
      res.writeHead(500);
    }
    res.end(
      "Proxy error: Could not proxy request " +
        req.url +
        " from " +
        host +
        " to " +
        proxy +
        " (" +
        err.code +
        ")."
    );
  };
}

function addMiddleware(devServer) {
  // `proxy` lets you to specify a fallback server during development.
  // Every unrecognized request will be forwarded to it.
  var proxy = require(paths.appPackageJson).proxy;
  devServer.use(
    historyApiFallback({
      // Paths with dots should still use the history fallback.
      // See https://github.com/facebookincubator/create-react-app/issues/387.
      disableDotRule: true,
      // For single page apps, we generally want to fallback to /index.html.
      // However we also want to respect `proxy` for API calls.
      // So if `proxy` is specified, we need to decide which fallback to use.
      // We use a heuristic: if request `accept`s text/html, we pick /index.html.
      // Modern browsers include text/html into `accept` header when navigating.
      // However API calls like `fetch()` won’t generally accept text/html.
      // If this heuristic doesn’t work well for you, don’t use `proxy`.
      htmlAcceptHeaders: proxy ? ["text/html"] : ["text/html", "*/*"]
    })
  );
  if (proxy) {
    if (typeof proxy !== "string") {
      console.log(
        chalk.red('When specified, "proxy" in package.json must be a string.')
      );
      console.log(
        chalk.red('Instead, the type of "proxy" was "' + typeof proxy + '".')
      );
      console.log(
        chalk.red(
          'Either remove "proxy" from package.json, or make it a string.'
        )
      );
      process.exit(1);
    }

    // Otherwise, if proxy is specified, we will let it handle any request.
    // There are a few exceptions which we won't send to the proxy:
    // - /index.html (served as HTML5 history API fallback)
    // - /*.hot-update.json (WebpackDevServer uses this too for hot reloading)
    // - /sockjs-node/* (WebpackDevServer uses this for hot reloading)
    // Tip: use https://jex.im/regulex/ to visualize the regex
    var mayProxy = /^(?!\/(index\.html$|.*\.hot-update\.json$|sockjs-node\/)).*$/;

    // Pass the scope regex both to Express and to the middleware for proxying
    // of both HTTP and WebSockets to work without false positives.
    var hpm = httpProxyMiddleware(pathname => mayProxy.test(pathname), {
      target: proxy,
      logLevel: "silent",
      onProxyReq: function(proxyReq, req, res) {
        // Browers may send Origin headers even with same-origin
        // requests. To prevent CORS issues, we have to change
        // the Origin to match the target URL.
        if (proxyReq.getHeader("origin")) {
          proxyReq.setHeader("origin", proxy);
        }
      },
      onError: onProxyError(proxy),
      secure: false,
      changeOrigin: true,
      ws: true
    });
    devServer.use(mayProxy, hpm);

    // Listen for the websocket 'upgrade' event and upgrade the connection.
    // If this is not done, httpProxyMiddleware will not try to upgrade until
    // an initial plain HTTP request is made.
    devServer.listeningApp.on("upgrade", hpm.upgrade);
  }

  // Finally, by now we have certainly resolved the URL.
  // It may be /index.html, so let the dev server try serving it again.
  devServer.use(devServer.middleware);
}

function runDevServer(host, port, protocol) {
  var devServer = new WebpackDevServer(compiler, {
    // Enable gzip compression of generated files.
    compress: true,
    // Silence WebpackDevServer's own logs since they're generally not useful.
    // It will still show compile warnings and errors with this setting.
    clientLogLevel: "none",
    // By default WebpackDevServer serves physical files from current directory
    // in addition to all the virtual build products that it serves from memory.
    // This is confusing because those files won’t automatically be available in
    // production build folder unless we copy them. However, copying the whole
    // project directory is dangerous because we may expose sensitive files.
    // Instead, we establish a convention that only files in `public` directory
    // get served. Our build script will copy `public` into the `build` folder.
    // In `index.html`, you can get URL of `public` folder with %PUBLIC_PATH%:
    // <link rel="shortcut icon" href="%PUBLIC_URL%/favicon.ico">
    // In JavaScript code, you can access it with `process.env.PUBLIC_URL`.
    // Note that we only recommend to use `public` folder as an escape hatch
    // for files like `favicon.ico`, `manifest.json`, and libraries that are
    // for some reason broken when imported through Webpack. If you just want to
    // use an image, put it in `src` and `import` it from JavaScript instead.
    contentBase: paths.appPublic,
    // Enable hot reloading server. It will provide /sockjs-node/ endpoint
    // for the WebpackDevServer client so it can learn when the files were
    // updated. The WebpackDevServer client is included as an entry point
    // in the Webpack development configuration. Note that only changes
    // to CSS are currently hot reloaded. JS changes will refresh the browser.
    hot: true,
    // It is important to tell WebpackDevServer to use the same "root" path
    // as we specified in the config. In development, we always serve from /.
    publicPath: config.output.publicPath,
    // WebpackDevServer is noisy by default so we emit custom message instead
    // by listening to the compiler events with `compiler.plugin` calls above.
    quiet: true,
    // Reportedly, this avoids CPU overload on some systems.
    // https://github.com/facebookincubator/create-react-app/issues/293
    watchOptions: {
      ignored: /node_modules/
    },
    // Enable HTTPS if the HTTPS environment variable is set to 'true'
    https: protocol === "https",
    host: host
  });

  // Our custom middleware proxies requests to /index.html or a remote API.
  addMiddleware(devServer);

  // Launch WebpackDevServer.
  devServer.listen(port, (err, result) => {
    if (err) {
      return console.log(err);
    }

    if (isInteractive) {
      clearConsole();
    }
    console.log(chalk.cyan("Starting the development server..."));
    console.log();

    if (isInteractive) {
      openBrowser(protocol + "://" + host + ":" + port + "/");
    }
  });
}

function run(port) {
  var protocol = process.env.HTTPS === "true" ? "https" : "http";
  var host = process.env.HOST || "localhost";
  setupCompiler(host, port, protocol);
  runDevServer(host, port, protocol);
}

// We attempt to use the default port but if it is busy, we offer the user to
// run on a different port. `detect()` Promise resolves to the next free port.
detect(DEFAULT_PORT).then(port => {
  if (port === DEFAULT_PORT) {
    run(port);
    return;
  }

  if (isInteractive) {
    clearConsole();
    var existingProcess = getProcessForPort(DEFAULT_PORT);
    var question =
      chalk.yellow(
        "Something is already running on port " +
          DEFAULT_PORT +
          "." +
          (existingProcess ? " Probably:\n  " + existingProcess : "")
      ) + "\n\nWould you like to run the app on another port instead?";

    prompt(question, true).then(shouldChangePort => {
      if (shouldChangePort) {
        run(port);
      }
    });
  } else {
    console.log(
      chalk.red("Something is already running on port " + DEFAULT_PORT + ".")
    );
  }
});
