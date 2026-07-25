import "./Footer.css";

const Footer = ({
  companyName = "Seller Portal",
  year = new Date().getFullYear(),
}) => {
  return (
    <footer className="footer">

      <p>
        © {year} {companyName}. All Rights Reserved.
      </p>

    </footer>
  );
};

export default Footer;