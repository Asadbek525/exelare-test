import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { CandidatesApi } from './candidates-api';

describe('CandidatesApi', () => {
  let service: CandidatesApi;
  let httpMock: HttpTestingController;
  const mockResponse = {
    records: [
      {
        ConsIntID: 'CS00019770',
        ConsultantID: 'Prashanth G',
        Title: '',
        FirstName: 'Prashanth',
        MiddleName: '',
        LastName: 'Gudala',
        Suffix: '',
        NickName: '',
        DisplayName: 'Prashanth Gudala',
        Available: false,
        CompanyName: 'Verizon',
        AvailabilityDate: null,
        AvailabilityNotice: '',
        JobTitle: 'Salesforce Lead',
        PrimarySkills:
          'SALESFORCE,APEX,LIGHTNING WEB COMPONENTS,AURA COMPONENTS,REST API,SOAP API,VISUALFORCE,SOQL,SOSL,SALES CLOUD,SERVICE CLOUD,EXPERIENCE CLOUD,CPQ,DATA CLOUD,AGENTFORCE,JENKINS,GITHUB,ANT,VS CODE,DATA LOADER,WORKBENCH,INFORMATICA CLOUD,AGILE,SCRUM,REQUIRE',
        SecondarySkills: '',
        OtherSkills: '',
        TotalExp: '',
        USExp: '',
        CommSkills: '',
        Rate: '',
        Relocation: '',
        ResumeDir: 'Database\\',
        ResumeFile: 'Prashanth_Gudala_Salesforce_Lead_Resume.pdf',
        ModifiedResumeDir: '',
        ModifiedResumeFile: '',
        ResumeWebPath: '',
        Summary:
          'Salesforce Lead with 7.6 years of experience specializing in Apex development, Lightning components, and Salesforce Clouds including Sales, Service, and Experience Clouds. Proven expertise in integrations, DevOps, and mentoring teams, delivering business value through technical leadership and solution design.',
        AdditionalInfo: '',
        ReferredBy: '',
        XMLResume: '',
        SSN: '',
        VisaStatus: '',
        VisaExpiryDate: null,
        Address1: '',
        Address2: '',
        Address3: '',
        City: '',
        State: '',
        ZipCode: '',
        Country: '',
        HomePhone: '',
        WorkPhone: '',
        MobilePhone: '+1-502-701-2010',
        Fax: '',
        EMail1: 'prashanthgudala843@gmail.com',
        EMail2: '',
        Salary: 0.0,
        SalaryReviewDate: null,
        BonusAmount: 0.0,
        BonusAmountDate: null,
        DOE: null,
        DOT: null,
        DOB: null,
        DOM: null,
        SpouseName: '',
        EmergencyContactName: '',
        EmergencyPhone: '',
        Notes: '',
        Archived: false,
        SendInHotList: false,
        Employee: false,
        JobType: 'Full-time',
        Categories: '',
        Groups: '',
        Owners: '',
        EmployeeNumber: '',
        OnHold: false,
        OnHoldTill: null,
        VacationDays: 6,
        SickDays: 4,
        TableHolidays: false,
        FloatHolidays: 2,
        LinkToIntID: '',
        UserIDs: ',Konstantin,',
        Private: false,
        CreateDate: '2025-10-15T11:04:00',
        EditDate: '2025-10-15T11:04:00',
        MergeDate: null,
        UserField1: '',
        UserField2: '',
        UserField3: '',
        UserField4: '',
        UserField5: '',
        UserField6: '',
        UserField7: 0.0,
        UserField8: 0.0,
        UserField9: '',
        UserField10: '',
        Field1: '',
        Field2: '',
        Field3: '',
        uuTimesheet: false,
        uuResumeText:
          'PRASHANTH REDDY GUDALA\r\nEmail: prashanthgudala843@gmail.com | Phone: +1-502-701-2010 | LinkedIn\r\n\r\n\r\nSalesforce Lead | 9x Salesforce Certified | 8.5+ Years of Experience\r\n\r\nProfessional Summary\r\nResults-driven Salesforce Lead with 8.5 years of experience in Apex development (Controllers,\r\nBatch, Scheduled Apex), LWC/Aura component development, REST/SOAP integrations, and\r\nVisualforce Pages. Skilled in Salesforce Sales, Service, and Experience Clouds with expertise in\r\ncreating workflows, triggers, technical documentation, mentoring developers on best practices\r\nand earning client recognition through consistent delivery of business value.\r\n\r\nCore Competencies\r\n•   Salesforce Platforms: Sales Cloud, Service Cloud, CPQ, Experience Cloud, Data cloud,\r\n    Agentforce\r\n•   Programming & Customization: Apex (Batch, Scheduled Apex, Triggers, Queueable, REST\r\n    API), LWC, Aura, Visualforce, SOQL, SOSL.\r\n•   Integrations: RESTful APIs, SOAP APIs, External System Integrations.\r\n•   DevOps & Tools: Jenkins, GitHub, ANT, VS Code, Data Loader, Workbench, Informatica Cloud\r\n•   Architecture & Admin: Security, Profiles, Roles, Flows, Workflows, Approvals, Reporting &\r\n    Dashboards\r\n•   Other Skills: Agile/Scrum, Requirement Gathering, Solution Design, Project Management,\r\n    Debugging, Testing, Maintenance, Technical Documentation, Talent Acquisition\r\n\r\nCertifications\r\n•   Developer/Admin: Salesforce Certified Platform Developer I, Salesforce Certified\r\n    Administrator\r\n•   Agent Force: Salesforce Certified AI Associate\r\n•   Cloud: Sales Cloud Consultant, Service Cloud Consultant, Platform App Builder\r\n•   Architect: Salesforce Certified Sharing & Visibility Architect, Salesforce Certified Data\r\n    Architect, Salesforce Certified Application Architect\r\n\r\nProfessional Experience\r\n\r\nVerizon – Dallas, USA\r\n\r\nSalesforce Lead | Mar 2022 – Present\r\n• Led Lightning migration initiatives, driving user adoption and improving order management\r\n    efficiency.\r\n•   Configured Salesforce CPQ (Product Rules, Price Rules, QLE, Quote Calculator Plugin),\r\n    enabling accurate quoting and pricing automation.\r\n•   Designed and deployed customer portals using LWC and Aura, improving customer\r\n    experience.\r\n•   Designed and implemented Data Cloud integrations to unify customer data from multiple\r\n    sources (Sales Cloud, Service Cloud, external databases), creating a single source of truth for\r\n    360° customer view.\r\n•   Built segmentation rules and calculated insights in Data Cloud, enabling targeted campaigns\r\n    and improved customer engagement.\r\n•   Configured data streams, data lake objects, identity resolution rules, and harmonization for\r\n    enterprise clients.\r\n•   Performed Apex code reviews, ensuring adherence to best practices.\r\n•   Created complex workflows, triggers, and Scheduled Apex jobs to automate processes.\r\n•   Partnered with DevOps team to optimize CI/CD pipelines in Jenkins, reducing release errors\r\n    and improving deployment speed.\r\n•   Delivered solutions using Apex triggers, batch jobs, and configuration enhancements\r\n    (reports, validations, metadata).\r\n•   Integrated Salesforce with external applications using RESTful and SOAP APIs.\r\n•   Produced technical documentation and provided technical solutions to business teams.\r\n•   Mentored team members on deployments, test automation, and best practices.\r\n•   Supported Windows server monitoring and collaborated cross-functionally to ensure system\r\n    health.\r\n\r\nSalesforce – Hyderabad, India\r\n\r\nProactive Monitoring Engineer | Oct 2019 – Dec 2021\r\n• Managed customer cases, delivered resolutions, and performed root cause analysis for\r\n   SEV1/SEV2 incidents.\r\n• Conducted annual technical health checks for enterprise Salesforce orgs, improving system\r\n   reliability.\r\n• Performed debugging, installation, and testing of Salesforce applications for enterprise\r\n   customers.\r\n• Reviewed data and provided technical recommendations to business stakeholders.\r\n• Collaborated on proof-of-concept solutions for strategic accounts like Intuit.\r\n• Maintained 95%+ QA scores and achieved zero-miss case transactions, ensuring consistent\r\n   client satisfaction.\r\n\r\nTata Consultancy Services (TCS) – Hyderabad, India\r\n\r\nSalesforce Developer | Jul 2016 – Jun 2019\r\nClient: Dupont\r\n•   Built a 360° Customer Data view in Service Cloud, integrating with multiple enterprise\r\n    applications (iPASS, CDB, EDP, SOO).\r\n•   Developed customized Service Cloud applications (case management, service contracts,\r\n    contact/account management).\r\n•   Developed Visualforce Pages and customized Service Cloud applications.\r\n•   Created Apex Controllers and scheduled jobs for automation.\r\n•   Built Aura components to enhance user experience.\r\n•   Automated user access management, reducing manual overhead for account provisioning.\r\n•   Implemented Lightning pages/components, Apex triggers, and batch jobs following best\r\n    practices.\r\n•   Contributed to release management using ANT and Git and participated in requirement\r\n    analysis and solution design.\r\n•   Mentored junior engineers, upskilling 3 into independent leads, which improved delivery\r\n    capacity.\r\n\r\nAwards & Recognition\r\n•   Customer Hero Award (2020) – Recognized for exceptional client support.\r\n•   Best Performer – Salesforce (2021)\r\n•   On-the-Spot Award (2019) – Outstanding contributions at Salesforce.\r\n•   Star Team Award (2017 & 2018), Best Performer Award (2018) – TCS.\r\n\r\nEducation\r\nBachelor of Technology (B.Tech) – JNTU Hyderabad, 2016',
        uuCandidateStatus: '',
        OwnershipCheck: 0,
        OwnershipDate: null,
        uuDisclaimer: false,
        uuAuthorized: false,
        uuBackground: false,
        uuOldNotes: '',
        uuTargetJobTitle: '',
        uuHighestEducation: '',
        uuAuthorizedToWorkIn: '',
        JobBoardIDs: '',
        uuSourceWebSites: '',
        uuCoUserIDs: '',
        uuActiveLicenses: '',
        uuLanguages: '',
        uuSpouseOccupation: '',
        uuHobbies: '',
        PostedJobURLs: '',
        ExternalJobIDs: '',
        PostedAPIs: '',
        OptOut: false,
        uuLinkedInURL: '',
        uuGooglePlusURL: '',
        uuFaceBookURL: '',
        uuTwitterURL: '',
        BounceCount: 0,
        LastBounceDate: null,
        LastActivityDate: null,
        LastActivityType: '',
        CreatedBy: '',
        ResumeDate: '2025-10-15T00:00:00',
        Rating: 0,
        Status: 'New',
        BillRate: 0.0,
        PayRate: 0.0,
        Burden: 0,
        Description: '',
        Certifications: '',
        TravelPreference: '',
        PendingTimeSheets: false,
        AdpUserID: '',
        AdpPwd: '',
        InsType: '',
        InsStartDt: null,
        InsEndDt: null,
        InsAmt: 0.0,
        InsTermDt: null,
        InsInfo: '',
        TimeShtRecDt: null,
        ExpShtRecDt: null,
        PaymentRecDt: null,
        ExpRecDt: null,
        CoveragePlan: '',
        VisaStartDate: null,
        VisaEndDate: null,
        WorkAddress1: '',
        WorkCity: '',
        WorkState: '',
        WorkZipCode: '',
        CheckBox1: false,
        CheckBox2: false,
        CheckBox3: false,
        CheckBox4: false,
        CheckBox5: false,
        DateField1: null,
        DateField2: null,
        DateField3: null,
        DateField4: null,
        DateField5: null,
        Summary1: '',
        Summary2: '',
        Summary3: '',
        DesiredSalary: 0.0,
        Industry: 'Information Technology,Telecommunications',
        Seniority: '',
        Languages: '',
        JobFunction: 'Salesforce Development and Leadership',
        IsContact: false,
        MirrorIntID: '',
        Compensation: '',
        uuMethodOfContact: '',
        uuNotary: false,
        TargetJobTitle: '',
        IndeedURL: '',
        uuIndeedURL: '',
        OpenedDate: '2025-12-19T21:22:36.267',
        OpenedBy: 'Vishnu',
        uuEditedBy: 'Konstantin',
        SMSOptOut: false,
        SkillMatrix:
          '[\r\n  {\r\n    "name": "SALESFORCE",\r\n    "years": "7.6",\r\n    "keywords": [\r\n      "Sales Cloud",\r\n      "Service Cloud",\r\n      "Experience Cloud",\r\n      "CPQ",\r\n      "Data Cloud",\r\n      "Agentforce",\r\n      "Visualforce",\r\n      "Apex",\r\n      "LWC",\r\n      "Aura"\r\n    ],\r\n    "level": 5\r\n  },\r\n  {\r\n    "name": "APEX",\r\n    "years": "7.6",\r\n    "keywords": [\r\n      "Batch Apex",\r\n      "Scheduled Apex",\r\n      "Triggers",\r\n      "Queueable",\r\n      "REST API",\r\n      "Code Reviews",\r\n      "Batch Jobs"\r\n    ],\r\n    "level": 5\r\n  },\r\n  {\r\n    "name": "LIGHTNING WEB COMPONENTS",\r\n    "years": "7.6",\r\n    "keywords": [\r\n      "LWC",\r\n      "Aura Components",\r\n      "Customer Portals",\r\n      "User Experience"\r\n    ],\r\n    "level": 4\r\n  },\r\n  {\r\n    "name": "AURA COMPONENTS",\r\n    "years": "7.6",\r\n    "keywords": [\r\n      "Aura",\r\n      "LWC",\r\n      "Customer Portals",\r\n      "User Experience"\r\n    ],\r\n    "level": 4\r\n  },\r\n  {\r\n    "name": "REST API",\r\n    "years": "7.6",\r\n    "keywords": [\r\n      "RESTful APIs",\r\n      "Integrations",\r\n      "External Applications"\r\n    ],\r\n    "level": 4\r\n  },\r\n  {\r\n    "name": "SOAP API",\r\n    "years": "7.6",\r\n    "keywords": [\r\n      "SOAP APIs",\r\n      "Integrations",\r\n      "External Applications"\r\n    ],\r\n    "level": 4\r\n  },\r\n  {\r\n    "name": "VISUALFORCE",\r\n    "years": "7.6",\r\n    "keywords": [\r\n      "Visualforce Pages",\r\n      "Customized Applications",\r\n      "Service Cloud"\r\n    ],\r\n    "level": 4\r\n  },\r\n  {\r\n    "name": "SOQL",\r\n    "years": "7.6",\r\n    "keywords": [\r\n      "SOQL",\r\n      "SOSL",\r\n      "Queries",\r\n      "Salesforce"\r\n    ],\r\n    "level": 4\r\n  },\r\n  {\r\n    "name": "SOSL",\r\n    "years": "7.6",\r\n    "keywords": [\r\n      "SOSL",\r\n      "SOQL",\r\n      "Queries",\r\n      "Salesforce"\r\n    ],\r\n    "level": 4\r\n  },\r\n  {\r\n    "name": "SALES CLOUD",\r\n    "years": "7.6",\r\n    "keywords": [\r\n      "Sales Cloud",\r\n      "Customer Data",\r\n      "Service Cloud",\r\n      "Data Cloud"\r\n    ],\r\n    "level": 5\r\n  },\r\n  {\r\n    "name": "SERVICE CLOUD",\r\n    "years": "7.6",\r\n    "keywords": [\r\n      "Service Cloud",\r\n      "Case Management",\r\n      "Customer Data",\r\n      "Visualforce"\r\n    ],\r\n    "level": 5\r\n  },\r\n  {\r\n    "name": "EXPERIENCE CLOUD",\r\n    "years": "2.3",\r\n    "keywords": [\r\n      "Experience Cloud",\r\n      "Customer Portals",\r\n      "LWC",\r\n      "Aura"\r\n    ],\r\n    "level": 4\r\n  },\r\n  {\r\n    "name": "CPQ",\r\n    "years": "2.3",\r\n    "keywords": [\r\n      "CPQ",\r\n      "Product Rules",\r\n      "Price Rules",\r\n      "Quote Calculator Plugin"\r\n    ],\r\n    "level": 4\r\n  },\r\n  {\r\n    "name": "DATA CLOUD",\r\n    "years": "2.3",\r\n    "keywords": [\r\n      "Data Cloud",\r\n      "Integrations",\r\n      "Segmentation Rules",\r\n      "Identity Resolution"\r\n    ],\r\n    "level": 4\r\n  },\r\n  {\r\n    "name": "AGENTFORCE",\r\n    "years": "2.3",\r\n    "keywords": [\r\n      "Agentforce",\r\n      "Salesforce",\r\n      "Customer Experience"\r\n    ],\r\n    "level": 3\r\n  },\r\n  {\r\n    "name": "JENKINS",\r\n    "years": "2.3",\r\n    "keywords": [\r\n      "Jenkins",\r\n      "CI/CD",\r\n      "DevOps",\r\n      "Deployment"\r\n    ],\r\n    "level": 4\r\n  },\r\n  {\r\n    "name": "GITHUB",\r\n    "years": "3.0",\r\n    "keywords": [\r\n      "GitHub",\r\n      "ANT",\r\n      "Release Management",\r\n      "Version Control"\r\n    ],\r\n    "level": 4\r\n  },\r\n  {\r\n    "name": "ANT",\r\n    "years": "3.0",\r\n    "keywords": [\r\n      "ANT",\r\n      "GitHub",\r\n      "Release Management",\r\n      "Deployment"\r\n    ],\r\n    "level": 4\r\n  },\r\n  {\r\n    "name": "VS CODE",\r\n    "years": "2.3",\r\n    "keywords": [\r\n      "VS Code",\r\n      "Development",\r\n      "Salesforce",\r\n      "IDE"\r\n    ],\r\n    "level": 3\r\n  },\r\n  {\r\n    "name": "DATA LOADER",\r\n    "years": "2.3",\r\n    "keywords": [\r\n      "Data Loader",\r\n      "Salesforce",\r\n      "Data Management"\r\n    ],\r\n    "level": 3\r\n  },\r\n  {\r\n    "name": "WORKBENCH",\r\n    "years": "2.3",\r\n    "keywords": [\r\n      "Workbench",\r\n      "Salesforce",\r\n      "Data Management"\r\n    ],\r\n    "level": 3\r\n  },\r\n  {\r\n    "name": "INFORMATICA CLOUD",\r\n    "years": "2.3",\r\n    "keywords": [\r\n      "Informatica Cloud",\r\n      "Data Integration",\r\n      "Salesforce"\r\n    ],\r\n    "level": 3\r\n  },\r\n  {\r\n    "name": "AGILE",\r\n    "years": "7.6",\r\n    "keywords": [\r\n      "Agile",\r\n      "Scrum",\r\n      "Project Management",\r\n      "Requirement Gathering"\r\n    ],\r\n    "level": 4\r\n  },\r\n  {\r\n    "name": "SCRUM",\r\n    "years": "7.6",\r\n    "keywords": [\r\n      "Scrum",\r\n      "Agile",\r\n      "Project Management",\r\n      "Requirement Gathering"\r\n    ],\r\n    "level": 4\r\n  },\r\n  {\r\n    "name": "REQUIREMENT GATHERING",\r\n    "years": "7.6",\r\n    "keywords": [\r\n      "Requirement Gathering",\r\n      "Solution Design",\r\n      "Project Management"\r\n    ],\r\n    "level": 4\r\n  },\r\n  {\r\n    "name": "SOLUTION DESIGN",\r\n    "years": "7.6",\r\n    "keywords": [\r\n      "Solution Design",\r\n      "Requirement Gathering",\r\n      "Project Management"\r\n    ],\r\n    "level": 4\r\n  },\r\n  {\r\n    "name": "PROJECT MANAGEMENT",\r\n    "years": "7.6",\r\n    "keywords": [\r\n      "Project Management",\r\n      "Agile",\r\n      "Scrum",\r\n      "Requirement Gathering"\r\n    ],\r\n    "level": 4\r\n  },\r\n  {\r\n    "name": "DEBUGGING",\r\n    "years": "7.6",\r\n    "keywords": [\r\n      "Debugging",\r\n      "Testing",\r\n      "Maintenance",\r\n      "Salesforce"\r\n    ],\r\n    "level": 4\r\n  },\r\n  {\r\n    "name": "TESTING",\r\n    "years": "7.6",\r\n    "keywords": [\r\n      "Testing",\r\n      "Debugging",\r\n      "Maintenance",\r\n      "Salesforce"\r\n    ],\r\n    "level": 4\r\n  },\r\n  {\r\n    "name": "MAINTENANCE",\r\n    "years": "7.6",\r\n    "keywords": [\r\n      "Maintenance",\r\n      "Debugging",\r\n      "Testing",\r\n      "Salesforce"\r\n    ],\r\n    "level": 4\r\n  },\r\n  {\r\n    "name": "TECHNICAL DOCUMENTATION",\r\n    "years": "7.6",\r\n    "keywords": [\r\n      "Technical Documentation",\r\n      "Mentoring",\r\n      "Salesforce",\r\n      "Solutions"\r\n    ],\r\n    "level": 4\r\n  },\r\n  {\r\n    "name": "TALENT ACQUISITION",\r\n    "years": "7.6",\r\n    "keywords": [\r\n      "Talent Acquisition",\r\n      "Mentoring",\r\n      "Team Management"\r\n    ],\r\n    "level": 3\r\n  }\r\n]',
        ProfileImageURL: '',
        ProfileImage: '',
        ImageURL: '',
        ExpectedPay: '',
        EmVerifiedStatus: '',
        EmVerifiedDate: null,
        HireezID: '',
        HubSpotID: '',
        uuPushToHubSpot: false,
        IndeedApplyID: '',
        OPT: false,
        LINJoinDate: null,
        PKQNIntIDs: '',
        Fake__ItemCaption: 'Candidate - Prashanth Gudala - Salesforce Lead - Verizon',
      },
    ],
  };
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(CandidatesApi);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Ensure no outstanding requests
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch and map candidates', () => {
    service.getCandidates().subscribe((res) => {
      expect(res.records.length).toBe(1);
      expect(res.records[0].FirstName).toBe('Prashanth');
    });

    const req = httpMock.expectOne('/api/Candidate.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should get candidate by id', () => {
    service.getCandidateById('CS00019770').subscribe((candidate) => {
      expect(candidate).toBeTruthy();
      expect(candidate?.FirstName).toBe('Prashanth');
    });

    const req = httpMock.expectOne('/api/Candidate.json');
    req.flush(mockResponse);
  });
});
