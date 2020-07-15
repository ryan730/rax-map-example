import { createElement, PureComponent, render } from 'rax';
import DriverUniversal from "driver-universal";
import { Map, Markers } from 'rax-map';
import View from 'rax-view';
import Text from 'rax-text';
const Touchable = View;

const style = {
  padding: '8px',
  backgroundColor: 'red',
  color: '#fff',
  border: '1px solid #fff',
  maxWidth: 200,
  fontSize: 24,
  textOverflow: 'ellipsis',
};

const currentPosition = () => ({
  longitude: 120.224559,
  latitude: 30.255570
});

const getMarker = (arr) => {
  //console.info('请求结果:', arr);
  return arr.map((e, idx) => {
    const { name, address, location } = e;
    console.log('获取的结果', name, address, location);
    return {
      position: {
        longitude: location.lng,
        latitude: location.lat
      },
      name, address,
      myIndex: idx + 1
    }
  })
};

const searchNearby = (keyword, city, cpoint, callback) => {

  window.AMap.service(['AMap.PlaceSearch'], () => {
    const MSearch = new AMap.PlaceSearch({
      city: city,
      citylimit: true,
      type: keyword
    });
    console.info('请求条件:', keyword, city, cpoint);
    MSearch.searchNearBy(keyword, cpoint, 5000, (status, result) => {
      if (status === 'complete' && result.info === 'OK') {
        if (result.poiList.pois.length) {
          const markers = getMarker(result.poiList.pois);
          callback && callback(markers);
        } else {
          console.info(`附近暂时没有${keyword}哦`, '');
        }
      }
    });
  });
}
let mapInstance = null;
export default class App extends PureComponent {
  constructor() {

    super();
    this.state = {
      markers: [],
      center: currentPosition(),
      zoom: 15,
      kd:'医院'
    }

    this.events = {
      created: (map) => {
        mapInstance = map;
        const center = mapInstance.getCenter();
        console.log('获取到map:', center.lng, center.lat);
        searchNearby(this.state.kd, '杭州', [center.lng, center.lat], (ms) => {
          this.setState({
            markers: ms
          })
        })
      },
    }
  
    this.randomMarkers = this.randomMarkers.bind(this);
  }

  randomMarkers() {
    const keywords = ['厕所', '商场', '超市', '酒店'];
    const center = mapInstance.getCenter();
    const rander = parseInt(Math.random() * keywords.length);
    searchNearby(keywords[rander], '杭州', [center.lng, center.lat], (ms) => {
      this.setState({
        markers: ms,
        kd: keywords[rander]
      })
    })
  }

  renderMarkerLayout(extData) {
    console.log('=========>>>', extData)
    if (extData.myIndex % 3 === 0) { // 使用原生marker样式
      return false;
    }
    return <Text numberOfLines={1} style={style}>{extData.name}</Text>
  }

  render() {
    return <View id='@map@' style={{ width: '100%', height: '100%' }}>
      <View style={{ width: '100%', height: '100%' }}>
        <Map
          amapkey={'12d37ebb0110bd05496fb6384bc78af0'}
          events={this.events}
          plugins={['ToolBar']}
          center={this.state.center}
          zoom={this.state.zoom}>
          <Markers
            markers={this.state.markers}
            render={this.renderMarkerLayout}
          />
        </Map>
      </View>
      <View style={rowStyle}>
        <Touchable style={touchStyle} onClick={this.randomMarkers.bind(this)}>
          点击:刷新多个 Markers,keyword:{this.state.kd}
        </Touchable>
      </View>
    </View>
  }
}

//https://restapi.amap.com/v3/log/init?s=rsv3&product=JsModule&key=12d37ebb0110bd05496fb6384bc78af0&m=AMap.PlaceSearch&callback=jsonp_400738_&platform=JS&logversion=2.0&sdkversion=1.3&posx=120.224559&posy=30.255570&location=浙江省+杭州市+江干区


// touch容器样式
const touchStyle = {
  borderStyle: 'solid',
  borderColor: '#dddddd',
  borderWidth: 1,
  padding: 2,
  margin: 5,
  width: 260,
  height: 120,
  backgroundColor: '#FFF',
  justifyContent: 'center',
  alignItems: 'center',
  fontSize: 5,
  textAlign: 'center',
  boxShadow: '5px 5px 5px #888888'
}

const rowStyle = {
  position: 'absolute',
  flexDirection: 'column',
  justifyContent: 'space-between',
  left: 80,
  top: 100
}

///render(<App />,mountNode,{ driver: DriverUniversal }); //实际开发中, mountNode不用传，这里是为了放入示例dom中