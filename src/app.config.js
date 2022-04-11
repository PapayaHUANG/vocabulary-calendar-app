export default defineAppConfig({
  pages: ["pages/index/index", "pages/list/list", "pages/info/info"],
  window: {
    backgroundTextStyle: "light",
    navigationBarBackgroundColor: "#fff",
    navigationBarTitleText: "WeChat",
    navigationBarTextStyle: "black",
  },
  tabBar: {
    color: "#282d36",
    list: [
      {
        pagePath: "pages/index/index",
        text: "首页",
      },
      {
        pagePath: "pages/list/list",
        text: "日历",
      },
      {
        pagePath: "pages/info/info",
        text: "详情",
      },
    ],
  },
});
