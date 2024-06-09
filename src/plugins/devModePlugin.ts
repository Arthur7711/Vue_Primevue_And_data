import App from "@/App.vue";
import DevMode from "@/stores/devMode";

export default {
  //@ts-ignore
  install: <T extends typeof App<any>>(app: T): any => {
    app.config.globalProperties.$screenp = {
      getters: {
        active: DevMode.getActive,
      },
      setters: {
        setActive: (active: boolean) => (DevMode.setActive = active),
      },
    };
  },
};

