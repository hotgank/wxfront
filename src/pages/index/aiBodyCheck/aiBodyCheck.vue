<template>
  <view class="container">
    <view class="header">
      <text class="title">{{ detectionType }}</text>
    </view>
    <view class="content">
      <view class="info-section">
        <text class="section-title">项目简介</text>
        <text class="section-content">{{ detectionInfo }}</text>
      </view>
      <button class="start-button" @tap="navigateToSelectProfile">开始测评</button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      detectionType: '', // 英文类型
      detectionInfo: '', // 中文描述
      typeMapping: {
        "head_tilt": "头部侧倾",
        "uneven_shoulders": "高低肩",
        "pelvic_tilt": "骨盆侧倾",
        "leg_length_discrepancy": "长短腿",
        "spinal_deviation": "脊柱异位",
        "leg_shape": "X/O/XO型腿"
      },
      infoMapping: {
        "头部侧倾": "头部侧倾检测通过对头部倾斜角度的分析，评估头部是否存在不对称倾斜的现象。检测可以帮助发现由于不良坐姿、颈部肌肉紧张或脊柱异常引起的头部歪斜问题，从而提供科学的矫正建议，改善头部和颈部的姿态。",
        "高低肩": "高低肩检测主要评估两侧肩膀的高度差异，识别是否存在一侧肩膀过高或过低的问题。通过检测可以发现因长期错误姿势、肩部肌肉失衡或脊柱弯曲导致的肩膀不对称，为调整体态和缓解肩颈疲劳提供指导。",
        "骨盆侧倾": "骨盆侧倾检测通过测量骨盆两侧的倾斜角度，判断是否存在骨盆不水平的问题。骨盆侧倾可能引起下背部疼痛、步态异常等不适，检测结果可用于早期预防骨盆相关问题，帮助改善体态稳定性。",
        "长短腿": "长短腿检测旨在识别双腿长度的差异，分析其对步态和骨骼平衡的影响。长短腿可能由骨骼发育异常、骨盆倾斜或肌肉张力不均引起，检测结果能够帮助用户发现问题，并寻求专业矫正方案。",
        "脊柱异位": "脊柱异位检测评估脊柱的排列状态，识别是否存在脊柱弯曲、偏移或异常的情况。该检测能够早期发现脊柱侧弯、驼背等问题，并提供针对性的调整建议，帮助保护脊柱健康。",
        "X/O/XO型腿": "腿型检测通过分析双腿形状，判断是否存在X型腿、O型腿或XO型腿等异常形态。这些腿型可能影响行走姿态和膝关节健康，检测结果可为纠正腿型提供指导，帮助实现更协调的双腿外观和功能。"
      }
    };
  },
  async onLoad(option) {
    // 获取传入的英文类型
    const type = option.type;

    // 映射英文类型到中文
    const chineseType = this.typeMapping[type];
    if (!chineseType) {
      uni.showToast({
        title: "未知的检测类型",
        icon: "none",
      });
      return;
    }

    // 设置中文检测类型和对应描述
    this.detectionType = chineseType;
    this.detectionInfo = this.infoMapping[chineseType];
  },

  methods: {
    navigateToSelectProfile() {
      uni.navigateTo({
        url: `/pages/selectProfile/selectProfile?type=${this.detectionType}`
      });
    }
  }
}
</script>

<style>
.container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.header {
  background-color: #ffffff;
  padding: 20px;
  border-bottom: 1px solid #e0e0e0;
}

.title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

.content {
  flex: 1;
  padding: 20px;
}

.info-section {
  background-color: #ffffff;
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 20px;
}

.section-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
  display: block;
}

.section-content {
  font-size: 16px;
  color: #666;
  line-height: 1.5;
}

.start-button {
  background-color: #007aff;
  color: #ffffff;
  padding: 15px;
  border-radius: 5px;
  font-size: 18px;
  text-align: center;
}
</style>