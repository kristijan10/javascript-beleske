# Leksicki this

```js
var obj = {
  id: "awesome",
  cool: function coolFn() {
    console.log(this.id);
  },
};

var id = "not awesome";

obj.cool(); // awesome
setTimeout(obj.cool, 100); // not awesome - Greska!
```

```js
var obj = {
  id: "awesome",
  cool: function coolFn() {
    setTimeout(() => {
      console.log(this.id);
    }, 100);
  },
};

obj.cool(); // awesome
```
