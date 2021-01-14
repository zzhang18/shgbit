const app = getApp();

Page({
  data: {
    baseUrl:"https://sany-jq.webex.com.cn/sany-jq/m.php?AT=JM&MK=",
    user: null,
    meetingId: null,
    finalUrl:null
  },
  onLoad: function() {
    console.log('Welcome to Gadget');

    tt.getUserInfo({
      success (res) {
          console.log(`getUserInfo 调用成功 ${res.userInfo}`);
          this.setData({
            user: res.userInfo
          });
      },
      fail (res) {
          console.log(`getUserInfo 调用失败`);
      }
    });

    tt.getHostLaunchQuery({
      success (res) {
          console.log(`传入的参数为 ${res.launchQuery}`);
          this.setData({
            meetingId:res.launchQuery
          });
      },
      fail (res) {
          console.log(`获取传入的参数失败`);
      }
    });

    if(this.data.user && this.data.meetingId){
      this.setData({
        finalUrl: this.data.url + this.data.meetingId + "&AN=" + this.data.user.nickName + "&AE=" + this.data.meetingId +"@sany.com.cn"
      });
    }else{
      this.setData({
        finalUrl: "https://sany-jq.webex.com.cn/webex/suspended.htm"
      });
    }
    
    tt.openSchema({
      schema: this.data.finalUrl,
      external: false,
      success (res) {
          console.log(`${res}`);
      },
      fail (res) {
          console.log(`open fail`);
      }
  });

  },
  
  onItemClick (event) {
    console.log('event',event);
    tt.openSchema({
        // schema: 'https://www.apple.com',
        schema: this.data.url + this.data.meetingId + "&AN=" + this.data.user.nickName + "&AE=" + this.data.meetingId +"@sany.com.cn",
        external: false,
        success (res) {
            console.log(`${res}`);
        },
        fail (res) {
            console.log(`open fail`);
        }
    });
  }

});
