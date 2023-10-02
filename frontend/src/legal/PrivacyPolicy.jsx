import React, { Fragment } from "react";
import "./Legal.css";
import { Typography } from "antd";

export default function PrivacyPolicy() {
  return (
    <Fragment>
      {/* <Navbar /> */}

      <main className="wrapper legal privacy-policy">
        <div className="header">
          <Typography.Title level={1}>Privacy Policy</Typography.Title>
        </div>

        <div className="item">
          <Typography.Title level={2}>Privacy Notice</Typography.Title>
          <Typography.Paragraph>
            This privacy notice discloses the privacy practices for
            schoolleadersadvantage.com. This privacy notice applies solely to
            information collected by this website. It will notify you of the
            following:
          </Typography.Paragraph>
          <Typography.Paragraph>
            <ul>
              <li>
                What personally identifiable information is collected from you
                through the website, how it is used and with whom it may be
                shared.
              </li>
              <li>
                What choices are available to you regarding the use of your
                data.
              </li>
              <li>
                The security procedures in place to protect the misuse of your
                information.
              </li>
              <li>How you can correct any inaccuracies in the information.</li>
            </ul>
          </Typography.Paragraph>
          <Typography.Title level={2}>
            Information Collection, Use, and Sharing
          </Typography.Title>
          <Typography.Paragraph>
            We are the sole owners of any information collected on this site. We
            only have access to/collect information that you voluntarily give us
            via our registration portal, email or other direct contact we have
            with you. We will not sell or rent this information to anyone.
          </Typography.Paragraph>
          <Typography.Paragraph>
            We will use your information to respond to you, regarding the reason
            you contacted us. We will not share your information with any third
            party outside of our organization.
          </Typography.Paragraph>
          <Typography.Paragraph>
            Unless you ask us not to, we may contact you via email in the future
            to tell you about newly added product features or changes to this
            privacy policy.
          </Typography.Paragraph>

          <Typography.Title level={2}>
            Your Access to and Control Over Information
          </Typography.Title>
          <Typography.Paragraph>
            You may opt out of any future contacts from us at any time. You can
            do the following at any time by contacting us via the email address
            posted on our website:
          </Typography.Paragraph>

          <Typography.Paragraph>
            <ul>
              <li>See what data we have about you, if any.</li>
              <li>Change/correct any data we have about you.</li>
              <li>Have us delete any data we have about you.</li>
              <li>Express any concern you have about our use of your data.</li>
            </ul>
          </Typography.Paragraph>

          <Typography.Title level={2}>Registration</Typography.Title>
          <Typography.Paragraph>
            In order to use this website, a user must first complete the
            registration form. During registration, a user is required to give
            certain information (such as name and email address). This
            information is used to contact you about the products/services on
            our site in which you have expressed interest. At your option, you
            may also provide demographic information (such as gender or age)
            about yourself, but it is not required.
          </Typography.Paragraph>

          <Typography.Title level={2}>Links</Typography.Title>
          <Typography.Paragraph>
            This website contains links to other sites. Please be aware that we
            are not responsible for the content or privacy practices of such
            other sites. We encourage our users to be aware when they leave our
            site and to read the privacy statements of any other site that
            collects personally identifiable information.
          </Typography.Paragraph>

          <Typography.Title level={2}>Cookies</Typography.Title>
          <Typography.Paragraph>
            We use &quot;cookies&quot; on this site. A cookie is a piece of data
            stored on a site visitor&apos;s hard drive to help us improve your
            access to our site and identify repeat visitors to our site. For
            instance, when we use a cookie to identify you, you would not have
            to log in a password more than once, thereby saving time while on
            our site. Cookies can also enable us to track and target the
            interests of our users to enhance the experience on our site. Usage
            of a cookie is in no way linked to any personally identifiable
            information on our site.
          </Typography.Paragraph>
          <Typography.Paragraph>
            Some of our business partners may use cookies on our site (for
            example, advertisers). However, we have no access to or control over
            these cookies.
          </Typography.Paragraph>

          <Typography.Title level={2}>Security</Typography.Title>
          <Typography.Paragraph>
            We take precautions to protect your information. When you submit
            sensitive information via the website, your information is protected
            both online and offline.
          </Typography.Paragraph>
          <Typography.Paragraph >
            Wherever we collect sensitive information (such as credit card
            data), that information is encrypted and transmitted to us in a
            secure way. You can verify this by looking for a lock icon in the
            address bar and looking for "https" at the beginning of the address
            of the Web page.
          </Typography.Paragraph>
          <Typography.Paragraph >
            While we use encryption to protect sensitive information transmitted
            online, we also protect your information offline. Only employees who
            need the information to perform a specific job (for example, billing
            or customer service) are granted access to personally identifiable
            information. The computers and servers in which we store personally
            identifiable information are kept in a secure environment.
          </Typography.Paragraph>

          <Typography.Title level={2}>Surveys & Contests</Typography.Title>
          <Typography.Paragraph >
            From time-to-time our site may request information via surveys or
            contests. Participation in these surveys or contests is completely
            voluntary and you may choose whether or not to participate and
            therefore disclose this information. Information requested may
            include contact information (such as name and shipping address), and
            demographic information (such as zip code, age level). Contact
            information will be used to notify the winners and award prizes.
            Survey information will be used for purposes of monitoring or
            improving the use and satisfaction of this site.
          </Typography.Paragraph>

          <Typography.Title  level={2}>Customer Notification</Typography.Title>
          <Typography.Paragraph>
            If you feel that we are not abiding by this privacy policy, please
            contact us immediately via email at{" "}
            <a
              href="mailto:info@inspiredschoolsolutions.com"
              target="_blank"
              rel="noopener"
            >
              info@inspiredschoolsolutions.com
            </a>
            .
          </Typography.Paragraph>
          <Typography.Paragraph>Thank you.</Typography.Paragraph>
        </div>
      </main>
    </Fragment>
  );
}
