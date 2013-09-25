/*
 * "Import" the Wiget class
 */
var Widget = require("./widget");

/*
 * Create an instance of a Widget, providing a lookup key
 */
var widget;

widget = new Widget("widget-1");

/*
 * Let's inspect at that instance. It's just an object
 */
console.log(widget);

/*
 * Now register it. This is an example of a "class" method. Note the
 * way that this call is made on the class reference
 */
Widget.register(widget);

/*
 * Now let's list all registered widgets - again a class method
 */
var id, all = Widget.all();

// As a array in one shot ...
console.log("Widgits:", all);

// ... or individually
for (id in all) {
  console.log(all[id]);
}

/*
 * Display the widget's id - an "instance" method
 */
console.log(widget.id());

/*
 * Unregister that widget - another "instance" method
 */
widget.unregister();

/*
 * List the widgets again shows that our single widgit instance has been removed
 */
all = Widget.all();
console.log("Widgits:", all);
