import { createElement } from 'rax';
import View from 'rax-view';
import Text from 'rax-text';

import './index.css';

import Map from '../../components/Map';

export default function Home() {
  return (
    <View style={{width:'100vw',height:'100vh'}}>
     <Map />
    </View>
  );
}



///render(<App />,mountNode,{ driver: DriverUniversal }); //实际开发中, mountNode不用传，这里是为了放入示例dom中