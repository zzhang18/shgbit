const app = getApp();

Page({
  data: {
  },

  onLoad: function() {
    console.log('Welcome to Gadget');
    this.onRedirect();
  },

  onRedirect(){

    tt.login({
      success (res) {
          console.log(`login 调用成功 ${res.code} `);
          tt.getUserInfo({
            success (res) {
                console.log(`getUserInfo 调用成功 ${res.userInfo}`);

                var userInfo = res.userInfo;

                tt.getHostLaunchQuery({
                  success (res) {
                      console.log(`传入的参数为 ${res.launchQuery}`);
                      var meetingId = res.launchQuery;
                      var url = "https://shjq.webex.com.cn/shjq/m.php";
                      if(meetingId){
                        url += "?AT=JM&MK=" + meetingId;
                      }
                      if(userInfo){
                        url += "&AN=" + userInfo.nickName + "&AE=" + meetingId +"@sany.com.cn"
                      }

                      console.log('final url', url);

                      tt.openSchema({
                        schema: url,
                        external: false,
                        success (res) {
                            console.log(`${res}`);
                        },
                        fail (res) {
                            console.log(`open fail`);
                        }
                      });

                  },
                  fail (res) {
                      console.log(`获取传入的参数失败`);
                  }
                });
            },
            fail (res) {
                console.log(`getUserInfo 调用失败`);
                console.log(`res`,res);
            }
          });
      },
      fail (res) {
          console.log(`login 调用失败`);
      }
  });

  }
  
});
