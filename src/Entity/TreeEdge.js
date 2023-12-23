import { TreeItemType } from "../nomenclature/nomenclature";

const createTreeEdge = (stateIndex, districtIndex, cityIndex, complexIndex) => {
  let type;

  if (districtIndex === undefined) {
    type = TreeItemType.State;
  } else if (cityIndex === undefined) {
    type = TreeItemType.District;
  } else if (complexIndex === undefined) {
    type = TreeItemType.City;
  } else {
    type = TreeItemType.Complex;
  }

  return {
    stateIndex,
    districtIndex,
    cityIndex,
    complexIndex,
    type,
  };
};

export default createTreeEdge;
