import NameValue from "../../Entity/NameValue";
import TreeEdge from "../../Entity/TreeEdge";

export function getComplexHierarchy(accessTree, treeEdge) {
  var stateIndex = treeEdge.stateIndex;
  var districtIndex = treeEdge.districtIndex;
  var cityIndex = treeEdge.cityIndex;
  var complexIndex = treeEdge.complexIndex;

  var state = accessTree.country.states[stateIndex];
  var district = accessTree.country.states[stateIndex].districts[districtIndex];
  var city =
    accessTree.country.states[stateIndex].districts[districtIndex].cities[
      cityIndex
    ];

  var hierarchy = {
    stateCode: state.code,
    state: state.name,
    district: district.name,
    city: city.name,
    districtCode: district.code,
    cityCode: city.code,
  };
  return hierarchy;
}

export function getAccessSummary(accessTree) {
  var stateCount = 0;
  var districtCount = 0;
  var cityCount = 0;
  var complexCount = 0;
  var displayComplex = [];
  console.log("_accessTree", accessTree);

  if (accessTree != undefined)
    accessTree.country.states.map((state, stateIndex) => {
      if (state.recursive == 1) {
        stateCount++;
      }
      if (state.districts != undefined)
        state.districts.map((district, districtIndex) => {
          if (district.recursive == 1) {
            districtCount++;
          }
          if (district.cities != undefined)
            district.cities.map((city, cityIndex) => {
              if (city.recursive == 1) {
                cityCount++;
              }
              if (city.complexes != undefined)
                city.complexes.map((complex, complexIndex) => {
                  complexCount++;
                  displayComplex.push(complex);
                });
            });
        });
    });

  return [
    NameValue("State", stateCount),
    NameValue("District", districtCount),
    NameValue("City", cityCount),
    NameValue("Complex", complexCount),
    NameValue("displayComplex", displayComplex),
  ];
}

export function getSelectionSummary(accessTree) {
  var stateCount = 0;
  var districtCount = 0;
  var cityCount = 0;
  var complexCount = 0;
  console.log("_accessTree", accessTree);

  if (accessTree != undefined)
    accessTree.country.states.map((state, stateIndex) => {
      if (state.selected == true) {
        stateCount++;
      }
      if (state.districts != undefined)
        state.districts.map((district, districtIndex) => {
          if (district.selected == true) {
            districtCount++;
          }
          if (district.cities != undefined)
            district.cities.map((city, cityIndex) => {
              if (city.selected == true) {
                cityCount++;
              }
              if (city.complexes != undefined)
                city.complexes.map((complex, complexIndex) => {
                  if (complex.selected == true) {
                    complexCount++;
                  }
                });
            });
        });
    });

  return [
    NameValue("State", stateCount),
    NameValue("District", districtCount),
    NameValue("City", cityCount),
    NameValue("Complex", complexCount),
  ];
}

export async function getTrimmedAccessTree(accessTree) {
  return new Promise(function (resolve, reject) {
    var emptyNodes = [];

    var trimmedAccessTree = JSON.parse(JSON.stringify(accessTree));
    trimmedAccessTree.country.recursive = 0;
    var selectedStateCount = 0;
    var activeStateCount = 0;
    if (accessTree != undefined)
      accessTree.country.states.map((state, stateIndex) => {
        if (state.selected == true) {
          trimmedAccessTree.country.states[stateIndex].recursive = 1;
          trimmedAccessTree.country.states[stateIndex].districts = undefined;
          selectedStateCount++;
          activeStateCount++;
        } else {
          trimmedAccessTree.country.states[stateIndex].recursive = 0;

          var selectedDistrictCount = 0;
          var activeDistrictCount = 0;
          if (state.districts != undefined)
            state.districts.map((district, districtIndex) => {
              if (district.selected == true) {
                trimmedAccessTree.country.states[stateIndex].districts[
                  districtIndex
                ].recursive = 1;
                trimmedAccessTree.country.states[stateIndex].districts[
                  districtIndex
                ].cities = undefined;
                selectedDistrictCount++;
                activeDistrictCount++;
              } else {
                trimmedAccessTree.country.states[stateIndex].districts[
                  districtIndex
                ].recursive = 0;

                var selectedCitiesCount = 0;
                var activeCitiesCount = 0;
                if (district.cities != undefined)
                  district.cities.map((city, cityIndex) => {
                    if (city.selected == true) {
                      trimmedAccessTree.country.states[stateIndex].districts[
                        districtIndex
                      ].cities[cityIndex].recursive = 1;
                      trimmedAccessTree.country.states[stateIndex].districts[
                        districtIndex
                      ].cities[cityIndex].complexes = undefined;
                      selectedCitiesCount++;
                      activeCitiesCount++;
                    } else {
                      trimmedAccessTree.country.states[stateIndex].districts[
                        districtIndex
                      ].cities[cityIndex].recursive = 0;

                      var selectedComplexesCount = 0;
                      if (city.complexes != undefined)
                        city.complexes.map((complex, complexIndex) => {
                          if (complex.selected == true) {
                            selectedComplexesCount++;
                          } else {
                            if (
                              trimmedAccessTree.country.states[stateIndex] !=
                                undefined &&
                              trimmedAccessTree.country.states[stateIndex]
                                .districts[districtIndex] != undefined &&
                              trimmedAccessTree.country.states[stateIndex]
                                .districts[districtIndex].cities[cityIndex] !=
                                undefined
                            ) {
                              //Remove Complex
                              //trimmedAccessTree[stateIndex].districts[districtIndex].cities[cityIndex].complexes.splice(complexIndex,1);
                              delete trimmedAccessTree.country.states[
                                stateIndex
                              ].districts[districtIndex].cities[cityIndex]
                                .complexes[complexIndex];
                              emptyNodes.push(
                                TreeEdge(
                                  stateIndex,
                                  districtIndex,
                                  cityIndex,
                                  complexIndex
                                )
                              );
                            }
                          }
                        });

                      if (selectedComplexesCount == 0) {
                        if (
                          trimmedAccessTree.country.states[stateIndex] !=
                            undefined &&
                          trimmedAccessTree.country.states[stateIndex]
                            .districts[districtIndex] != undefined
                        ) {
                          //Remove City
                          //trimmedAccessTree[stateIndex].districts[districtIndex].cities.splice(cityIndex,1);
                          delete trimmedAccessTree.country.states[stateIndex]
                            .districts[districtIndex].cities[cityIndex];
                          emptyNodes.push(
                            TreeEdge(stateIndex, districtIndex, cityIndex)
                          );
                        }
                      } else {
                        activeCitiesCount++;
                      }
                    }
                  });

                if (activeCitiesCount == 0) {
                  if (
                    trimmedAccessTree.country.states[stateIndex] != undefined
                  ) {
                    //Remove District
                    delete trimmedAccessTree.country.states[stateIndex]
                      .districts[districtIndex];
                    emptyNodes.push(TreeEdge(stateIndex, districtIndex));
                    //trimmedAccessTree[stateIndex].districts.splice(districtIndex,1);
                  }
                } else {
                  activeDistrictCount++;
                }
              }
            });

          if (activeDistrictCount == 0) {
            //Remove State
            emptyNodes.push(TreeEdge(stateIndex));
            delete trimmedAccessTree.country.states[stateIndex];
            //trimmedAccessTree.splice(stateIndex,1);
          } else {
            activeStateCount++;
          }
        }
      });

    var resultantTree = JSON.parse(JSON.stringify(trimmedAccessTree));
    console.log("_trimmedAccessTree", JSON.stringify(resultantTree));
    var state;
    var popStateCount = 0;

    for (
      var stateIndex = 0;
      stateIndex < trimmedAccessTree.country.states.length;
      stateIndex++
    ) {
      state = trimmedAccessTree.country.states[stateIndex];

      var district;
      var popDistrictCount = 0;
      if (state != undefined && state.districts != undefined) {
        for (
          var districtIndex = 0;
          districtIndex < state.districts.length;
          districtIndex++
        ) {
          district = state.districts[districtIndex];

          var city;
          var popCityCount = 0;
          if (district != undefined && district.cities != undefined) {
            for (
              var cityIndex = 0;
              cityIndex < state.districts.length;
              cityIndex++
            ) {
              city = district.cities[cityIndex];

              var complex;
              var popComplexCount = 0;
              if (city != undefined && city.complexes != undefined) {
                for (
                  var complexIndex = 0;
                  complexIndex < city.complexes.length;
                  complexIndex++
                ) {
                  complex = city.complexes[complexIndex];
                  if (complex == undefined) {
                    resultantTree.country.states[
                      stateIndex - popStateCount
                    ].districts[districtIndex - popDistrictCount].cities[
                      cityIndex - popCityCount
                    ].complexes.splice(complexIndex - popComplexCount, 1);

                    popComplexCount++;
                  }
                }
              } else {
                if (city == undefined) {
                  resultantTree.country.states[
                    stateIndex - popStateCount
                  ].districts[districtIndex - popDistrictCount].cities.splice(
                    cityIndex - popCityCount,
                    1
                  );
                  popCityCount++;
                }
              }
            }
          } else {
            if (district == undefined) {
              resultantTree.country.states[
                stateIndex - popStateCount
              ].districts.splice(districtIndex - popDistrictCount, 1);
              popDistrictCount++;
            }
          }
        }
      } else {
        if (state == undefined) {
          resultantTree.country.states.splice(stateIndex - popStateCount, 1);
          popStateCount++;
        }
      }
    }

    resolve(resultantTree);
  });
}

export async function getAccessKeys(accessTree) {
  return new Promise(function (resolve, reject) {
    var accessKeys = [];

    if (accessTree != undefined)
      accessTree.country.states.map((state, stateIndex) => {
        if (state.selected == true) {
          accessKeys.push({ key: state.code, type: "State" });
        }
        if (state.districts != undefined)
          state.districts.map((district, districtIndex) => {
            if (district.selected == true) {
              accessKeys.push({ key: district.code, type: "District" });
            }
            if (district.cities != undefined)
              district.cities.map((city, cityIndex) => {
                if (city.selected == true) {
                  accessKeys.push({ key: city.code, type: "City" });
                }
                if (city.complexes != undefined)
                  city.complexes.map((complex, complexIndex) => {
                    if (complex.selected == true) {
                      accessKeys.push({ key: complex.uuid, type: "Complex" });
                    }
                  });
              });
          });
      });

    resolve(accessKeys);
  });
}
