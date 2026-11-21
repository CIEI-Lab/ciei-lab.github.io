# 资料与素材来源

核对日期：2026 年 11 月 20 日。

## 实验室介绍

名称、所属学院、研究定位与四个方向根据用户提供的《华东师范大学认知智能与具身交互实验室介绍-v2》草稿整理。

## 网站设计参考

- [PIS Lab](https://pis-lab.github.io/)：展示节奏、共享实验平台影像。
- [LoT Lab](https://qyanglab.github.io/)：学术导航与实验室介绍的信息组织。

新版布局、交互网络、概念图与代码为本项目制作。概念图不表示实验数据。

## 代表论文

- Dong Xue, Xuanjie Zhou, Ming Wang, Fangzhou Liu. Formation control and path planning of multi-robot systems via large language models. Science China Information Sciences 68(5): 150205 (2025). [原文](https://doi.org/10.1007/s11432-024-4290-4)。
  将运动约束、机器人状态与局部环境转为文本输入，由大语言模型生成运动目标并转译为控制指令。通过仿真实验研究编队生成与重构、避障以及延迟和扰动下的协同控制。
- Dong Xue, Ziyao Shao, Zhaoyang Duan, Fangzhou Liu, Bing Li, Zhongheng Zhang. Doctor Sun: a bilingual multimodal large language model for biomedical AI. PeerJ Computer Science 12: e3853 (2026). [原文](https://doi.org/10.7717/peerj-cs.3853)。
  将视觉编码器与医学语言模型结合，通过特征对齐和指令微调连接医学图像与文本。配套发布双语医学多模态数据集 SunMed-VL，支持医学问答、视觉问答等研究。
- Dong Xue, Jicheng Tu, Ming Wang, Xin Yan, Fangzhou Liu, Jie Hu. Towards Privacy-Preserving Mental Health Support with Large Language Models. arXiv:2601.01993v2 (2026). [原文](https://arxiv.org/abs/2601.01993)。
  通过多智能体角色协作与双闭环反馈构建合成心理支持对话数据。结合联邦学习、LoRA 和差分隐私，研究心理支持语言模型的训练效果与隐私泄露风险。
- Ming Wang, Zhaoyang Duan, Dong Xue, Fangzhou Liu, Zhongheng Zhang. An enhanced privacy-preserving federated few-shot learning framework for respiratory disease diagnosis. Applied Soft Computing 190: 114586 (2026). [原文](https://doi.org/10.1016/j.asoc.2026.114586)。
  面向标注数据稀缺与数据无法集中共享的医学场景，研究融合元学习与联邦训练的小样本诊断框架。引入差分隐私机制，考察不同数据分布下的学习适应能力与隐私保护。
- Zhaoyang Duan, Jiangwei Yan, Dong Xue, Fangzhou Liu, Yang Tang. Opinion Dynamics on Higher-Order Social Networks: A Continuous-Time Perspective. IEEE Transactions on Systems, Man, and Cybernetics: Systems 56(8): 4612-4624 (2026). [原文](https://doi.org/10.1109/tsmc.2026.3686176)。
  以超图刻画群聊和集体讨论中的高阶交互，建立连续时间观点演化模型。分析有无固执个体时的收敛与稳定性，研究高阶交互和弱关系对观点形成的影响。
- Dong Xue, Jiangwei Yan, Jingxi Zhu, Zhaoyang Duan, Jie Huang. The opinion-dependent product spread over higher-order social networks. Chaos, Solitons & Fractals 209: 118490 (2026). [原文](https://doi.org/10.1016/j.chaos.2026.118490)。
  研究个体观点如何影响社会网络中的产品采纳与传播。将群体结构带来的高阶社会影响与隐性弱关系纳入模型，刻画超越成对口碑传播的扩散机制。
- Yimeng Qi, Dong Xue, Fangzhou Liu. Opinion diversity shaped by higher-order interactions on multi-dimensional issues. Chaos, Solitons & Fractals 194: 116188 (2025). [原文](https://doi.org/10.1016/j.chaos.2025.116188)。
  将多维议题与高阶网络交互结合，研究真实社会中不同观点的形成与共存。考察固执程度、社会影响与高阶交互对观点分布的作用。
- Yifan Chen, Anlan Li, Xiangyang Li, Dong Xue, Jian Long. Efficient JITL framework for nonlinear industrial chemical engineering soft sensing based on adaptive multi-branch variable scale integrated convolutional neural networks. Advanced Engineering Informatics 58: 102199 (2023). [原文](https://doi.org/10.1016/j.aei.2023.102199)。
  针对动态化工过程中关键变量难以准确测量的问题，研究即时学习软测量方法。通过自适应多分支、多尺度卷积网络，支持面向工况变化的局部建模。
- Dong Xue, Sandra Hirche, Ming Cao. Evolution of social power over influence networks containing antagonistic interactions. Information Sciences 540: 449-468 (2020). [原文](https://doi.org/10.1016/j.ins.2020.05.142)。
  研究同时存在正向与对抗关系的社会网络，刻画连续议题讨论中的观点与社会影响力演化。构建反映式自我评价模型，分析网络结构如何决定长期影响力分布。
- Dong Xue, Sandra Hirche. Distributed Topology Manipulation to Control Epidemic Spreading Over Networks. IEEE Transactions on Signal Processing 67(5): 1163-1174 (2019). [原文](https://doi.org/10.1109/tsp.2018.2887211)。
  在缺少集中协调者的条件下，研究通过移除或重连网络边抑制传播的分布式方法。将事件触发通信、分布式谱估计与协同决策结合，支持仅依赖局部信息的拓扑调控。

论文图示取自原文，对应文献、图号与预印本版本已在网页标注。Doctor Sun 的期刊引用为 2026 年，展示图和开放 PDF 来自对应预印本。MindChat 标明预印本状态。

## 开源项目

- [MindChat](https://github.com/X-D-Lab/MindChat)
- [Sunsimiao](https://github.com/X-D-Lab/Sunsimiao)
- [GradChat](https://github.com/X-D-Lab/GradChat)
- [XrayQwen](https://github.com/X-D-Lab/XrayQwen)
- [Doctor Sun](https://github.com/X-D-Lab/Doctor-Sun)

产品资料根据仓库说明摘要整理；原始标识与许可见 `assets/projects/SOURCE.md` 及相应 LICENSE 文件。网页未运行远程模型服务。

## 共享实验平台

人机交互、沉浸式环境、眼动实验和自适应 XR 场景素材来自 [PIS Lab Studio](https://pis-lab.github.io/#studio)，出处保存在本文件与素材清单。学院资源关系由用户说明，页面不显示团队推广链接。未给素材强加具体设备型号、房间或预约方式。

## 教师资料

[薛栋 ORCID](https://orcid.org/0000-0002-5426-1164)。研究兴趣根据本人可核实论文及华师大官方教师主页归纳。

## 第三版视觉素材与设计参考

新增 [LoT Lab 成员页](https://qyanglab.github.io/team/) 与 [UCL Brain Sciences](https://www.ucl.ac.uk/brain-sciences/) 的明暗与图文层级研究。

`assets/art/cognition-field.png` 为本项目生成的原创概念插画，内置 Imagegen 生成；详见 `assets/art/GENERATION.md`。`cognition-field.js` 是原创概念可视化，不表示实验测量结果。实验场景继续使用前述素材，出处留存在本文件与素材清单。


## 第七版：黑白视觉与教师资料（2026-11-20）

- [薛栋 · 华东师范大学官方教师主页](https://faculty.ecnu.edu.cn/_s9/xd2/main.psp)：核实当前教授、博士生导师身份，心理与认知科学学院人工智能与人因工程系，公开邮箱与办公室、三项教育经历以及部分学术服务。英文由中文官方资料翻译；官网英文入口为空模板。页面不迁移旧工作经历、旧单位实验室介绍、招生与培养草稿或未核实的招生名额。
- [Google Scholar](https://scholar.google.com/citations?user=ognfTWIAAAAJ&hl=en)：入口取自上述教师主页。
- [Juventus 官方首页](https://www.juventus.com/it)：研究其黑白对比、深浅层级、清晰字重与细分隔线的视觉语言；网站仍采用实验室的学术信息架构。未使用其队徽、定制字体、照片或品牌资产。

界面、认知场和概念插画采用灰阶；论文研究图保留原始颜色，避免改变科学图例。已有高分辨率教师照片继续使用，未用低分辨率缩略图替换。


## 第八版：官方内容补全与局部色彩（2026-11-20）

重新以普通 HTTPS 请求读取[华东师范大学薛栋教师主页](https://faculty.ecnu.edu.cn/_s9/xd2/main.psp)，返回200。逐条核录“学术成果”“科研项目”“招生与培养”；本轮原文与第七版存档内容一致。

- 官网42篇论文与原有10篇按DOI去重，保留原有MindChat预印本，共43篇；新增33篇。其中官网论文30篇有Crossref或原始期刊元数据佐证，12篇按官网记录整理。未将网络获取失败解释为不存在。
- 11本题名完整的著作、8项专利申请公开、12项软著根据官网核录。残缺书名《DeepSeek 图解：大模型是怎么的》暂不展示。没有编造ISBN、发明人、权利人或授权状态。
- 教师个人项目清单仅保留在工作核录档案中，第十版已撤下其中全部23项科研与企业承接记录。网站项目页只保留用户确认属于团队的8项公开模型与工具；项目介绍与可用源代码分别处理，不宣称全部开放了完整实现。
- 本轮根据用户新的要求，招聘页补入四类参与路径、公开邮箱、申请材料与流程；此前未完成的拟招名额、薪酬及年度承诺继续不迁入。
- 核录证据、原文、来源URL及元数据核对结果随相应内容的source/verification字段保存。部分会议的官网文献年与元数据年份不同，保留官网口径与核对记录，不自行猜测。

设计重新对照[Juventus](https://www.juventus.com/it)、[LoT Lab成员页](https://qyanglab.github.io/team/)与[PIS Lab](https://pis-lab.github.io/)的官方HTML/CSS：黑白建立层级，局部主题色与真实彩色影像保留。最终视觉层改为theme.css；取消第七版的强制灰阶。未使用尤文队徽、定制字体或商业照片。


## 第九版：背景、精选论文、产品与资源（2026-11-20）

重新对照Juventus官方CSS的后置媒体处理：放大后景、blur(15px)和黑色渐变。本项目使用自有认知插画、网络图及已有实验场景作为后景，未复制尤文商业影像。模糊只应用到后景图，不改变前景科研图、真实照片或正文。

首页四篇分别覆盖社会认知、健康智能、具身协同与智能工程；科研页使用J41/J40/J39三篇2026年近期研究。卷期年份/月不等同首次在线日期。没有可复用研究图的条目使用原创主题封面，封面不伪装成原论文图，也不提供原图放大。

8个公开产品/工具及其资源来自本轮核对的官方教师页与各README：MindChat、Sunsimiao、GradChat、XrayQwen、Doctor Sun、LangChain-ChatGLM-Webui、GPT_SoVITS_Inference、PUA。LangChain工具与语音工具保留上游归属；未主张底层框架均独立原创。GradChat、PUA仅有公开介绍材料，因此代码按钮禁用。空产品占位已按用户要求移除。

产品示意图由本项目以原生SVG制作，按稳定key对应实际产品构图；图示表达产品主题，不是产品运行截图或实验数据。

### 原文摘要来源与许可

11条原摘要按可复用许可保留原文，作者与文献信息随记录展示；另31篇依据核实后的论文摘要或原稿内容整理中英文概述，其余1篇保留原文入口。arXiv摘要使用CC0元数据条款，论文全文/图示许可单独处理；不把一般Crossref摘要自动当作CC0。

- [Doctor Sun: a bilingual multimodal large language model for biomedical AI](https://peerj.com/articles/cs-3853)；版本：version_of_record；[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)。
- [Towards Privacy-Preserving Mental Health Support with Large Language Models](https://arxiv.org/abs/2601.01993v2)；版本：preprint；[CC0 1.0 (arXiv abstract metadata)](https://creativecommons.org/publicdomain/zero/1.0/)。
- [An enhanced privacy-preserving federated few-shot learning framework for respiratory disease diagnosis](https://arxiv.org/abs/2507.08050v1)；版本：preprint；[CC0 1.0 (arXiv abstract metadata)](https://creativecommons.org/publicdomain/zero/1.0/)。
- [Large language models in emergency and critical care medicine: a comprehensive review of applications, challenges, and future directions](https://doi.org/10.1093/burnst/tkag026)；版本：version_of_record；[Creative Commons BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/)。
- [Data-Driven Distributionally Robust Optimal Power Flow for Distribution Grids Under Wasserstein Ambiguity Sets](https://doi.org/10.3390/electronics14040822)；版本：version_of_record；[Creative Commons BY 4.0](https://creativecommons.org/licenses/by/4.0/)。
- [A Networked Meta-Population Epidemic Model with Population Flow and Its Application to the Prediction of the COVID-19 Pandemic](https://doi.org/10.3390/e26080654)；版本：version_of_record；[Creative Commons BY 4.0](https://creativecommons.org/licenses/by/4.0/)。
- [Consensus Driven by the Geometric Mean](https://arxiv.org/abs/1511.02604v2)；版本：preprint；[CC0 1.0 (arXiv abstract metadata)](https://creativecommons.org/publicdomain/zero/1.0/)。
- [H∞ Formation Control and Obstacle Avoidance for Hybrid Multi-Agent Systems](https://doi.org/10.1155/2013/123072)；版本：version_of_record；[Creative Commons BY 3.0](http://creativecommons.org/licenses/by/3.0/)。
- [Consensus analysis of networked multi-agent systems](https://www.sciencedirect.com/science/article/pii/S1875389210002828)；版本：version_of_record；[CC BY-NC-ND 3.0](https://creativecommons.org/licenses/by-nc-nd/3.0/)。

非商业/禁止改编许可条目不翻译、不修改原摘要；网页保留许可入口。摘要全文与许可取证字段保存在两份内容数据中。


## 第十版：项目边界与首页学术排版

- 移除 research-01…11、commissioned-01…12：个人承接记录不能据研究方向相近而计作实验室项目。不留空分类或项目占位。
- 保留用户确认属于团队的 X-D-Lab 公开项目，不宣称 CIEI 为原始立项、资助或承担单位。
- 首页背景采用4张本项目原创原生SVG（about / research / publications / tools）及已有认知场与实验平台影像；暗化和模糊仅应用于后景。原生背景为主题示意，无伪造数据、标签或实验环境实拍主张。
- 视觉参考：Juventus 的图像后景和深浅层次；PIS Lab 的主题图形；Mengyue Wu、Ru-Yuan Lab、Westlake Deep Learning Lab 和 Real Life & Real Learning Lab 的简介、研究与论文优先的信息层级。没有复制这些站点的品牌、照片、人物或成果。
- 近期研究使用稳定的媒体/正文容器与显式网格区域，兼容浏览器外链扩展插入的旁挂元素。本地诊断页可模拟外链后插入按钮；诊断脚本不进入发布目录。


## 第十一版：摘要补全与产品清理

删除空产品占位，保留8个实际模型或工具。论文列表尽量补入期刊、arXiv、作者机构库及可核对DOI的论文摘要元数据；未核实到内容的条目不凭题名编写。

原文摘要与概述在页面上分别标注，全文研究概述不冒充原文摘要。完整原文沿用可复用许可并保留版本与来源；arXiv元数据许可不等同PDF正文许可。索引复现的原论文摘要只作为核对与概述来源，不据此认定转载许可。预印本与正式版区分，预印本作者列表存在差异时不覆盖正式发表记录。

新增原文来源：[Flexible mitigation of epidemics by transport management](https://doi.org/10.1016/j.chaos.2025.116211)，CC BY 4.0；[Distributed Link Removal Strategy… arXiv:2006.16221v1](https://arxiv.org/abs/2006.16221v1)，arXiv摘要元数据CC0。所有概述保留各条目的abstractURL及verification.abstractEvidence记录。


### 导师新招聘说明

2026-11-21用户提供导师新写的招聘说明，作为招聘页的直接内容来源。整理为两类全职岗位，完整保留年度拟招名额、博士后一般聘期、学位/年龄的一般条件、A/B/卓越类别要求及年薪下限、科研助理拟聘用方式、待遇与学校审核约定、申请材料和邮件主题。新增5项实验室在研课题；导师简介精简整合，未迁入历史单位履历。说明文字中的“心理与认知科学院”按既有正式名称统一为“心理与认知科学学院”。新稿未被表述为已独立核验的学校政策公告。
