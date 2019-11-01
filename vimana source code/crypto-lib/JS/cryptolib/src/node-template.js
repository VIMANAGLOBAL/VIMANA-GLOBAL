import factory from "./factories/basic"
import KeyGenerator from './app/KeyGenerator'

class NodeTemplate {
  KeyGenerator () {
    const KeyGenerator = KeyGenerator.generateKeys();
    console.log(',,,,,,,,,,,,,,,');
    console.log(KeyGenerator);
    console.log('<<<<<<<<<<<<<<<');
    return KeyGenerator;
  }
}




export default factory(NodeTemplate)
