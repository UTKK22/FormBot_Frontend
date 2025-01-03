import styles from "./Footer.module.css";
import icon from "/home_images/contact.svg";
import {logo } from "../../data/useImportAssets"
function Footer() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
     
        <div>
          <p style={{display:"flex",alignItems:"center",}}><img className={styles.svgIcon} alt="" src={logo} />
          <span><b>FormBot</b></span>
          </p>
          <p style={{fontWeight:"200"}}>Made with ❤️ by</p>
          <p style={{textDecoration:"underline",fontWeight:"200"}}> @cuvette</p>
        </div>
        <div className={styles.column}>
          <h4>Product</h4>
          <p>
            Status <img src={icon} />
          </p>
          <p>
            Documentation <img src={icon} />
          </p>
          <p>
            Roadmap <img src={icon} />
          </p>
          <p>
            Pricing <img src={icon} />
          </p>
        </div>
        <div className={styles.column}>
          <h4>Commmunity</h4>
          <p>
            Discord <img src={icon} />
          </p>
          <p>
            GitHub repository <img src={icon} />
          </p>
          <p>
            Twitter <img src={icon} />
          </p>
          <p>
            LinkedIn <img src={icon} />
          </p>
          <p>
            OSS Friends <img src={icon} />
          </p>
        </div>
        <div className={styles.column}>
          <h4>Company</h4>
          <p>
            About <img src={icon} />
          </p>
          <p>
            Contact <img src={icon} />
          </p>
          <p>
            Terms of Service <img src={icon} />
          </p>
          <p>
            Privacy Policy <img src={icon} />
          </p>
        </div>
      </div>
    </div>
  );
}

export default Footer;