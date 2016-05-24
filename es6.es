var human = {
    breathe(name) {   //不需要function也能定义breathe函数。
        console.log(name + ' is breathing...');
    }
};
human.breathe('jarson');   //输出 ‘jarson is breathing...’


var lis = document.getElementsByTagName('li');

for(let i=0;i<lis.length;i++){
    lis[i].onclick = function () {

        console.log(lis[i]);
    }
};




(foo, bar) => foo + bar

let names = [ 'Will', 'Jack', 'Peter', 'Steve', 'John', 'Hugo', 'Mike' ]

let newSet = names
  .map((name, index) => {
    return {
      id: index,
      name: name
    }
  })
  .filter(man => man.id % 2 == 0)
  .map(man => [man.name])
  .reduce((a, b) => a.concat(b))

console.log(newSet) 


let obj = {
  hello: 'world',
  foo() {
    let bar = () => {
      return this.hello
    }
    return bar
  }
}

window.hello = 'ES6'
window.bar = obj.foo()
window.bar() //=> 'world'