import Vue from "vue";
import ToastificationContent from "@core/components/toastification/ToastificationContent.vue";

export const toast = (icon, variant, text) => {
  Vue.$toast({
    component: ToastificationContent,
    position: "top-right",
    props: {
      title: `提示：`,
      icon,
      variant,
      text,
    },
  });
};
