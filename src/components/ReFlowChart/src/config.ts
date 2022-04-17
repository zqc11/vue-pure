export const BpmnNode = [
  {
    type: "bpmn:startEvent",
    text: "开始",
    class: "bpmn-start",
    properties: {
      description: "",
      checkers: [],
      status: "",
      orderNum: 0
    }
  },
  {
    type: "bpmn:endEvent",
    text: "结束",
    class: "bpmn-end",
    properties: {
      description: "",
      checkers: [],
      status: "",
      orderNum: -1
    }
  },
  {
    type: "bpmn:exclusiveGateway",
    text: "网关",
    class: "bpmn-exclusiveGateway",
    properties: {
      description: "",
      checkers: [],
      status: "未开始",
      orderNum: -1
    }
  },
  {
    type: "bpmn:userTask",
    text: "任务",
    class: "bpmn-user",
    properties: {
      description: "",
      checkers: [],
      status: "未开始",
      orderNum: -1
    }
  }
];
