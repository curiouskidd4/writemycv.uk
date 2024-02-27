const headerTemplate = `<div style="display: flex; width: 100%; justify-content:flex-end;">
<img style="height: 48px; padding:0px 50px;" src="data:image/png;base64,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" alt="" /></div>`;

const footerTemplate = `<div style="width:100%; padding: 0px 20px; font-family: Arial; font-size: 9px; color: #b3b3b3; opacity: 0.5; ">
    <div>
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 0 20px;">
        <span >+44 (0) 1474 850707</span>
        <div style="height: 12px; border-right: 1px solid grey "></div>

        <span >
          <a href="mailto:contactus@wearehowells.co.uk" style="color: #b3b3b3;text-decoration:none">
            contactus@wearehowells.co.uk
          </a>
        </span>
        <div style="height: 12px; border-right: 1px solid grey "></div>

        <span >
          <a href="https://wearehowells.co.uk" style="color: #b3b3b3; text-decoration:none">
            wearehowells.co.uk
          </a>
        </span>
        <div style="height: 12px; border-right: 1px solid grey "></div>

        <span >
          <a href="https://www.instagram.com/wearehowells/" style="color: #b3b3b3;text-decoration:none;display: flex;align-content: center;align-items: center;gap: 4px;">
          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="currentColor" class="bi bi-linkedin" viewBox="0 0 16 16">
          <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854zm4.943 12.248V6.169H2.542v7.225zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248S2.4 3.226 2.4 3.934c0 .694.521 1.248 1.327 1.248zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016l.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225z"></path>
        </svg>

            @wearehowells
          </a>
        </span>
        <div style="height: 12px; border-right: 1px solid grey "></div>

        <span >
          <a href="https://www.linkedin.com/company/wearehowells/" style="color: #666;text-decoration:none;display: flex;align-content: center;align-items: center;gap: 4px;">
            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" style="
      width: 10px;
  " fill="currentColor" class="bi bi-twitter" viewBox="0 0 16 16">
              <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334q.002-.211-.006-.422A6.7 6.7 0 0 0 16 3.542a6.7 6.7 0 0 1-1.889.518 3.3 3.3 0 0 0 1.447-1.817 6.5 6.5 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.32 9.32 0 0 1-6.767-3.429 3.29 3.29 0 0 0 1.018 4.382A3.3 3.3 0 0 1 .64 6.575v.045a3.29 3.29 0 0 0 2.632 3.218 3.2 3.2 0 0 1-.865.115 3 3 0 0 1-.614-.057 3.28 3.28 0 0 0 3.067 2.277A6.6 6.6 0 0 1 .78 13.58a6 6 0 0 1-.78-.045A9.34 9.34 0 0 0 5.026 15"></path>
            </svg>

            @wearehowells
          </a>
        </span>
      </div>
      <div style="display: flex; justify-content: center; align-items: center; padding: 0 20px; margin-top: 2px">
        <span >Howells, Unit 1, First Floor, Caxton House, 22 St Johns Hill, Sevenoaks, Kent, TN13 3NP</span>
      </div>
    </div>`;

export { footerTemplate, headerTemplate };
