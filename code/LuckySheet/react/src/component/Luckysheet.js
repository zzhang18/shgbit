import React from 'react';
class Luckysheet extends React.Component {

    componentDidMount() {
        const luckysheet = window.luckysheet;
        var options = {
            container: 'luckysheet', //luckysheet is the container id
            fullscreenmode: false,
            data: [{ "name": "Sheet1", color: "", "status": "1", "order": "0", "data": [], "config": {}, "index":0 }],
            // userMenuItem: [{url:"www.sougou.com", "icon":'', "name":"My Sheet"}, {url:"www.baidu.com", "icon":'', "name":"Exit"}],
            plugins: ['chart'],
            column: 6,
            row: 8,
            "ch_width": 800, //The width of the worksheet area
            "rh_height": 300, //The height of the worksheet area
        }
        luckysheet.create(options)
    }
    render() {
        const luckyCss = {
            margin: '0px',
            padding: '0px',
            position: 'absolute',
            width: '100%',
            height: '100%',
            left: '0px',
            top: '0px'
        }
        return (
            <div
            id="luckysheet"
            style={luckyCss}
            ></div>
        )
    }
}

export default Luckysheet