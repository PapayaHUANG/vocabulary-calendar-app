import React, { useState } from "react";
import { View, Text } from "@tarojs/components";
import "./index.css";
import Description from "../../components/Description";

export default () => {
  const [formIsShow, setFormIsShow] = useState(false);

  return <View className="index">{!formIsShow && <Description />}</View>;
};
