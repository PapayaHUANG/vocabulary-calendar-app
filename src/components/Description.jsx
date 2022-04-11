import React from "react";
import { View } from "@tarojs/components";

const descriptionInfo = [
  "本工具借鉴了杨鹏在《17天搞定GRE单词》提出的记忆方法;",
  "本工具会根据你输入的信息，动态生成单词记忆日历；",
  "重复时间间隔为1、2、4、8、15、30天；",
  "日历中带*号的表示要复习的项目；",
  "本工具的使用场景不局限于单词记忆;",
  "点击下方按钮输入信息生成日历。",
];

export default function Description() {
  return (
    <View className="description">
      <View className="description__title">日历生成原理及使用方法</View>
      <View className="description__detail">
        {descriptionInfo.map((item, i) => {
          return <View key={i}>{item}</View>;
        })}
      </View>
    </View>
  );
}
