import { AnalyzeResult } from "./triggerEngine";

interface ActionProps {
  setActiveTab: (tab: string) => void;
  setIsModalOpen: (isOpen: boolean) => void;
  setSelectedTime: (time: string) => void;
}

export function executeAiAction(result: AnalyzeResult, props: ActionProps) {
  const { type, payload } = result.action;

  switch (type) {
    case "SWITCH_TAB":
      if (payload?.tab) props.setActiveTab(payload.tab);
      break;
    case "OPEN_BOOKING_MODAL":
      if (result.entities.time && !payload?.clearTime) {
        props.setSelectedTime(result.entities.time);
      } else if (payload?.clearTime) {
        props.setSelectedTime("");
      }
      props.setIsModalOpen(true);
      break;
    case "NONE":
    default:
      break;
  }
}