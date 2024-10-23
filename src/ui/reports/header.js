import {
    colorTheme,
    whiteSurfaceCircularBorder,
    complexCompositionStyle,
  } from "../../jsStyles/Style";
import icToilet from "../../assets/img/icons/ic_toilet.png";


const Header = () => {
    return (
      <div
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          background: colorTheme.primary,
          padding: "10px",
        }}
      >
        <div
          style={{
            ...whiteSurfaceCircularBorder,
            float: "left",
            padding: "10px",
            width: "50px",
            height: "50px",
          }}
        >
          <img
            src={icToilet}
            alt={icToilet}
            style={{
              width: "30px",
              height: "30px",
              borderRadius: "5%",
            }}
          />
        </div>

        <div style={{ float: "left", marginLeft: "10px" }}>
          <div style={{ ...complexCompositionStyle.complexTitleClient }}>
            {"User Access Tree "}
          </div>
        </div>
      </div>
    );
  };

  export default Header;