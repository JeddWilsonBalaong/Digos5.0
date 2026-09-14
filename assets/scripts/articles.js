/* RBDigos website — news & advisory content. Newest first.
   Add an article by adding an entry here; no HTML editing required.

   id        URL slug — becomes article.html?id=<id>. Keep it stable once published.
   tagClass  one of tag--notice, tag--urgent, tag--rates (see site.css).
   date      display string, dd MMM yyyy.  iso  machine date for <time datetime>.
   body      array of blocks. Supported types:
               { type: "p",  text: "..." }
               { type: "h2", text: "..." }
               { type: "ul", items: ["...", "..."] }
             Text is inserted with textContent, so write plain text — not HTML.
   banner      optional { file: "CEC_BANNER.png" } — image in assets/images/articles/,
               used as the background of the article header. Filenames are case-sensitive on the server.
   attachments optional array of { file: "CEC.pdf", label: "..." } — files in assets/docs/,
               shown as download rows under the article body.
             file is a bare filename (no folders); entries with a path are ignored. */
window.RBD_ARTICLES = [
  {
    id: "rbdi-cec-2026",
    tag: "Announcement",
    tagClass: "tag--notice",
    date: "20 Aug 2026",
    iso: "2026-08-20",
    title: "Currency Exchange Center (CEC) at RBDI",
    summary: "RBDI Exchange Services for Unfit and Mutilated Philippine Currency",
    banner: { file: "CEC_BANNER.png" },
    body: [
      { type: "p", text: "RBDI is proud to be recognized as the first rural bank in the Davao Region to become a Cash Exchange Center (CEC), based on the approved announcement. RBDI provides exchange services for unfit and mutilated Philippine banknotes and coins to both clients and non-clients, making the service more accessible to the community." },
      { type: "p", text: "A downloadable PDF version is available below for customers who wish to read and keep a copy of the announcement." }
    ],
    attachments: [
      { file: "CEC.pdf", label: "Currency Exchange Center (CEC) announcement" }
    ]
  },
  {
    id: "longer-loan-terms-2026",
    tag: "Loans",
    tagClass: "tag--rates",
    date: "19 Aug 2026",
    iso: "2026-08-19",
    title: "Longer Loan Terms Now Available at RBDI",
    summary: "RBDI offers loan terms of up to seven years for LGU Salary Loans and up to five years for SSS, GSIS, and PVAO Pension Loans. Visit the nearest RBDI office to learn more and apply.",
    body: [
      { type: "p", text: "More time to pay. More flexibility for qualified borrowers." },
      { type: "p", text: "Rural Bank of Digos, Inc. is offering extended repayment terms for qualified LGU employees and pensioners. The longer terms are designed to provide borrowers with greater flexibility and more manageable payment schedules." },
      { type: "h2", text: "Loan terms" },
      {
        type: "ul",
        items: [
          "LGU Salary Loan — up to 7 years, available to qualified LGU employees.",
          "Pension Loan — up to 5 years, for qualified SSS, GSIS and PVAO pensioners."
        ]
      },
      { type: "h2", text: "How to apply" },
      { type: "p", text: "Visit the RBDI office nearest you for inquiries and application assistance. You may also call us at +082 553-4641 or email rbdigos@rbap.org." },
      { type: "p", text: "Loan applications are subject to applicable documentary requirements, credit evaluation, approval, and the Bank's prevailing policies and terms." }
    ]
  },
  {
    id: "client-appreciation-day-2026",
    tag: "Announcement",
    tagClass: "tag--notice",
    date: "07 Aug 2026",
    iso: "2026-08-07",
    title: "Client Appreciation Day",
    summary: "Don Marcelino branch will host its main anniversary celebration and Client Appreciation Day on Friday, August 7, 2026, allowing visiting clients to join in the festivities during regular weekday operating hours.",
    body: [
      { type: "p", text: "Our Don Marcelino branch will hold its main anniversary celebration and Client Appreciation Day on Friday, 07 August 2026. The branch stays open for its regular weekday hours, so clients who drop by for their usual transactions are welcome to join the festivities while they are with us." },
      { type: "p", text: "Client Appreciation Day is our way of thanking the depositors, borrowers and partners who have banked with Rural Bank of Digos across seven decades of service in Davao del Sur, Davao Occidental and North Cotabato." },
      { type: "h2", text: "What to expect" },
      {
        type: "ul",
        items: [
          "Regular over-the-counter banking hours — deposits, withdrawals and loan payments proceed as normal.",
          "Refreshments and a short programme for clients visiting the branch during the day.",
          "Branch staff on hand to answer questions about savings, time deposit and loan products."
        ]
      },
      { type: "h2", text: "Good to know" },
      { type: "p", text: "Only the Don Marcelino branch is holding the celebration. All other offices keep their usual schedule, and no service interruption is expected at any branch on this date." },
      { type: "p", text: "For questions about the event or about your account, call us at +082 553-4641 or email rbdigos@rbap.org." }
    ]
  },
  {
    id: "holiday-banking-schedule-august-2026",
    tag: "Advisory",
    tagClass: "tag--notice",
    date: "04 Aug 2026",
    iso: "2026-08-04",
    title: "Holiday banking schedule — August 2026",
    summary: "All offices are closed on 21 and 31 August 2026.",
    body: [
      { type: "p", text: "Please take note of the declared holidays this month. All Rural Bank of Digos offices — head office and every branch — will be closed on the dates below, and normal banking resumes on the next working day." },
      { type: "h2", text: "Closure dates" },
      {
        type: "ul",
        items: [
          "Friday, 21 August 2026 — Ninoy Aquino Day. All offices closed.",
          "Monday, 31 August 2026 — National Heroes Day. All offices closed.",
          "Banking resumes at the usual opening time on the next working day after each holiday."
        ]
      },
      { type: "h2", text: "Planning around the closures" },
      { type: "p", text: "If you have a loan amortisation, check payment or deposit that falls due on either date, please transact on the preceding banking day so your account is not affected." },
      { type: "p", text: "Cheques deposited on the banking day before a holiday will follow the normal clearing cycle, which resumes once offices reopen." },
      { type: "p", text: "For anything urgent during a closure, contact us at +082 553-4641 or rbdigos@rbap.org and we will attend to you on the next banking day." }
    ]
  }

  /* --- Previously published notices. Uncomment an entry to put it back on the
         newsletter page; each one already has a working detail page. ---

  ,{
    id: "phishing-sms-using-the-rbdigos-name",
    tag: "Security",
    tagClass: "tag--urgent",
    date: "18 Jul 2026",
    iso: "2026-07-18",
    title: "Phishing SMS using the RBDigos name",
    summary: "We never ask for your OTP, PIN or password. Report suspicious messages to your branch.",
    body: [
      { type: "p", text: "We have received reports of text messages that use the Rural Bank of Digos name to ask clients for their one-time PIN, account PIN or password. These messages did not come from us." },
      { type: "h2", text: "What we will never do" },
      { type: "ul", items: [
        "We will never ask for your OTP, PIN or password — not by SMS, not by email, not by phone.",
        "We will never send you a link asking you to re-enter your account details.",
        "We will never ask you to move your money to a \"safe\" account."
      ] },
      { type: "h2", text: "If you receive one" },
      { type: "p", text: "Do not reply and do not tap any link. Delete the message, then call your branch on the number printed on this site to confirm anything that concerns your account." }
    ]
  },
  {
    id: "core-system-maintenance-28-june-2026",
    tag: "Service",
    tagClass: "tag--notice",
    date: "24 Jun 2026",
    iso: "2026-06-24",
    title: "Core system maintenance, 28 June, 10 PM – 2 AM",
    summary: "Over-the-counter services are unaffected.",
    body: [
      { type: "p", text: "Scheduled maintenance on our core banking system runs from 10:00 PM on 28 June 2026 to 2:00 AM the following morning." },
      { type: "p", text: "Over-the-counter services at all branches are unaffected, as the work falls outside banking hours." }
    ]
  },
  {
    id: "time-deposit-rates-updated-june-2026",
    tag: "Rates",
    tagClass: "tag--rates",
    date: "01 Jun 2026",
    iso: "2026-06-01",
    title: "Time deposit rates updated",
    summary: "New rates apply to placements made from 01 June 2026.",
    body: [
      { type: "p", text: "Our time deposit rates have been updated. The new rates apply to placements made from 01 June 2026 onward; existing placements keep the rate agreed at booking until maturity." },
      { type: "p", text: "Ask any branch for the current rate sheet, or call +082 553-4641." }
    ]
  }

  --- */
];
