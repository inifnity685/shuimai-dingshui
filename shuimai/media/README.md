# media 资源说明（视频版）

两个 HTML 共用本文件夹；HTML 必须和 media 文件夹放在同一层。

## 结构
- video/   过场视频（H.264 / AAC，1280×720）
- img/     概念图（WebP，1600×900 / 2048×2048）
- portrait/ 人物立绘（WebP，512×512）
- pack_external.js  唯一的过场实现（旧 canvas MV / CG 已删除）

## 视频映射
| 文件 | 触发位置 |
|---|---|
| video/prologue.mp4 | 开场 · 序（10s） |
| video/spring1950.mp4 | 开场 · 山泉 1950（8s） |
| video/opening.mp4 | 开场 MV（15s） |
| video/arrival.mp4 | 报到（开场最后 / 第一幕） |
| video/drought.mp4 | 第二幕 · 旱冬（第 3 回合） |
| video/flood.mp4 | 第三幕 · 决堤（第 6 回合） |
| video/boat.mp4 | 第四幕 · 前夜（第 9 回合） |
| video/spring_choice.mp4 | 结局前 · 泉边抉择（任期结束） |
| video/spring_revive.mp4 | 洪山泉重生 |

## 图片映射
| 文件 | 位置 |
|---|---|
| img/cover.webp | 封面背景 |
| img/panorama.webp | 四区图鉴横幅 |
| img/zone_*.webp | 四区详情弹窗 |
| img/dongshan.webp / reclaim.webp | 四区图鉴 |
| img/poster_flood.webp / poster_boat.webp | 决堤 / 纸船海报、结局前夜背景 |
| img/ending.webp | 结局弹窗背景 |
| portrait/*.webp | 人物图鉴 + 对话栏 |

## 加新视频
1. 放进 video/，建议 1280×720 H.264。
2. pack_external.js 顶部 var V 里加 key: 'media/video/xxx.mp4'。
3. 在对应位置调用 playVideo('key', { title, line })：开场在 playVideoOpening，幕间在 playActOpening，结局/仪式在 playDecisionCG / playCeremony。

## 对话场景
- 结算后的 NPC 叙事场景由 pack_external.js 用 npc 立绘 + 区域概念图替换旧 canvas。
- 全站 NPC 头像通过覆盖 npcAvatar 换成新立绘。
