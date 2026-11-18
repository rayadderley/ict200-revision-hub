/* Original ICT200 practice, paraphrased from the current lecture scope.
   No source paper, slide image, textbook extract, or private marking scheme is bundled. */
window.ICT200_CONTENT = {
  chapters: [
    {
      id: "ch1", title: "Database systems", kicker: "Chapter 1", summary: "Data, information, DBMS functions, database types and the problems caused by file-based storage.",
      focus: ["Data are raw facts; information gives those facts meaning in context.", "A DBMS helps define, store, secure, retrieve and recover data.", "Repeated data can produce insertion, update and deletion anomalies."],
      cards: [
        ["Data vs information", "Data are raw facts. Information is data processed or presented to answer a question."],
        ["Metadata", "Data that describe other data, such as a column's name, type or permitted values."],
        ["Update anomaly", "The same fact is stored in several places and changing only some copies leaves inconsistent values."],
        ["Five system components", "Hardware, software, people, procedures and data."]
      ],
      questions: [
        {type:"mcq", prompt:"A customer address is stored in three separate files. Updating only one copy causes which problem?", options:["Structural independence","Update anomaly","Data abstraction","Entity integrity"], answer:1, why:"The same fact now has conflicting copies."},
        {type:"mcq", prompt:"Which DBMS function helps restore data after a failure?", options:["Backup and recovery","File naming","Report colouring","Manual filing"], answer:0, why:"Backup and recovery support restoration after data loss or failure."},
        {type:"tf", prompt:"A field is one property of a record, such as a student's date of birth.", answer:true, why:"A record groups related fields for one occurrence."},
        {type:"fill", prompt:"What do we call data that describe the structure or meaning of other data?", answers:["metadata"], why:"Metadata includes definitions such as field names, types and constraints."}
      ]
    },
    {
      id: "ch2", title: "Data models", kicker: "Chapter 2", summary: "Entities, attributes, relationships, constraints, business rules and levels of abstraction.",
      focus: ["A data model describes data and the rules connecting it.", "The four basic building blocks are entity, attribute, relationship and constraint.", "Business rules should be clear enough to identify entities, relationships and limits."],
      cards: [
        ["Entity", "A distinguishable type of object or event that the system needs to record."],
        ["Attribute", "A property that describes an entity, such as a course title."],
        ["Relationship", "An association between entity occurrences."],
        ["Constraint", "A rule limiting which values or relationships are valid."]
      ],
      questions: [
        {type:"mcq", prompt:"In a model for courses, which item is an attribute of COURSE?", options:["CourseTitle","ENROLMENT","A student registers","Only active students may register"], answer:0, why:"CourseTitle describes a COURSE occurrence."},
        {type:"mcq", prompt:"Which statement is a business rule rather than an entity name?", options:["CUSTOMER","PRODUCT","Each order belongs to one customer","OrderDate"], answer:2, why:"It states how the organization links records."},
        {type:"tf", prompt:"A constraint may restrict an attribute to a permitted range of values.", answer:true, why:"A range is a domain constraint."},
        {type:"fill", prompt:"Name the model building block that associates two entity types.", answers:["relationship"], why:"A relationship represents an association."}
      ]
    },
    {
      id: "ch3", title: "Relational model", kicker: "Chapter 3", summary: "Tables, keys, dependencies, integrity rules and 1:1, 1:M and M:N links.",
      focus: ["A primary key uniquely identifies each table row and cannot be null.", "A foreign key refers to a parent key; referential integrity concerns that reference.", "An M:N relationship becomes two 1:M relationships through an associative table."],
      cards: [
        ["Primary key", "A chosen candidate key that uniquely identifies a row; its value must not be null."],
        ["Foreign key", "A child-table attribute whose value references a parent table's key."],
        ["Entity integrity", "Primary-key values must be unique and not null."],
        ["Referential integrity", "A non-null foreign-key value must match an existing referenced parent key."]
      ],
      questions: [
        {type:"mcq", prompt:"A customer row uses CustomerID to identify it. What role does CustomerID have in CUSTOMER?", options:["Foreign key","Primary key","Repeating group","Derived attribute"], answer:1, why:"The chosen row identifier is a primary key."},
        {type:"mcq", prompt:"How is STUDENT M:N COURSE normally represented with tables?", options:["Copy every course into STUDENT","Use an ENROLMENT table with both keys","Remove COURSE","Make both IDs nullable"], answer:1, why:"The bridge turns the M:N link into two 1:M links."},
        {type:"tf", prompt:"A foreign key may reference a parent row that does not exist and still satisfy referential integrity.", answer:false, why:"A non-null FK needs a matching referenced key."},
        {type:"fill", prompt:"What integrity rule requires a primary key to be unique and non-null?", answers:["entity integrity"], why:"That rule protects row identity."}
      ]
    },
    {
      id: "ch4", title: "ER modelling", kicker: "Chapter 4", summary: "Chen and Crow's Foot reading, cardinality, participation, weak entities and supertypes/subtypes.",
      focus: ["Connectivity describes 1:1, 1:M or M:N; participation says whether an occurrence must take part.", "A weak entity is existence-dependent and may use the parent's key in its identifier.", "A subtype inherits the supertype's identifier and common attributes."],
      cards: [
        ["Cardinality", "The minimum and maximum number of related occurrences allowed by a business rule."],
        ["Associative entity", "An entity inserted to resolve M:N and record facts about the association."],
        ["Weak entity", "An existence-dependent entity identified in part through its owning parent."],
        ["Disjoint subtype", "A supertype occurrence belongs to no more than one of the stated subtypes."]
      ],
      questions: [
        {type:"mcq", prompt:"One lecturer teaches many courses; each course has one lecturer. What is the connectivity?", options:["1:1","1:M","M:N","No relationship"], answer:1, why:"One LECTURER can be associated with many COURSE occurrences."},
        {type:"mcq", prompt:"A BOOK can have several AUTHORS and an AUTHOR can write several BOOKS. What is needed in a relational design?", options:["BOOK_AUTHOR bridge","A comma-separated AuthorIDs field","Delete AUTHOR","A single fixed AuthorID in BOOK"], answer:0, why:"A bridge represents the many-to-many relationship."},
        {type:"tf", prompt:"A composite attribute can be divided into meaningful smaller attributes.", answer:true, why:"An address might be divided into street, town and postcode."},
        {type:"fill", prompt:"What term describes a relationship from an entity type back to the same entity type?", answers:["recursive relationship","recursive","self referring relationship","self-referring relationship"], why:"The same entity type participates in two roles."}
      ]
    },
    {
      id: "ch5", title: "Normalization", kicker: "Chapter 5", summary: "Repeating groups, functional dependencies and the route from 1NF to 3NF.",
      focus: ["1NF removes repeating groups and makes each stored value atomic.", "2NF removes partial dependency on part of a composite key.", "3NF removes transitive dependency of non-key facts on other non-key facts."],
      cards: [
        ["1NF", "One value per cell and no repeating groups, with rows identifiable by a key."],
        ["Partial dependency", "A non-key attribute depends on only part of a composite candidate/primary key."],
        ["Transitive dependency", "A non-key fact depends on another non-key fact rather than directly on the key."],
        ["3NF", "A table in 2NF with no transitive dependency of non-key attributes on its key."]
      ],
      questions: [
        {type:"mcq", prompt:"A field contains “Wi-Fi, TV, minibar” in one cell. Which issue should be addressed first?", options:["Repeating/multivalued data for 1NF","Only a transitive dependency","Only a missing index","A backup failure"], answer:0, why:"The cell holds multiple values instead of one atomic value."},
        {type:"mcq", prompt:"With key (OrderID, ProductID), ProductName depends only on ProductID. What dependency is this?", options:["Partial","Transitive","Derived","Recursive"], answer:0, why:"ProductName depends on only one part of the composite key."},
        {type:"tf", prompt:"A table with a single-attribute primary key can have a partial dependency on part of that key.", answer:false, why:"A single-attribute key has no smaller key part."},
        {type:"fill", prompt:"Which normal form removes transitive dependencies after 2NF?", answers:["3nf","third normal form","third normal form 3nf"], why:"Third normal form addresses non-key-to-non-key dependencies."}
      ]
    },
    {
      id: "ch6", title: "Database design", kicker: "Chapter 6", summary: "SDLC, DBLC, requirements, conceptual/logical/physical design and design strategies.",
      focus: ["The DBLC moves from initial study through design, implementation/loading, testing/evaluation, operation and maintenance/evolution.", "Conceptual design models data requirements without choosing physical storage details.", "Top-down starts with larger data sets; bottom-up begins with data elements."],
      cards: [
        ["DBLC", "Database life cycle: initial study, design, implementation/loading, testing/evaluation, operation, maintenance/evolution."],
        ["Initial study", "Identify the problem, objectives, constraints, scope and boundaries before designing."],
        ["Top-down", "Start with high-level data sets/entities and refine them into attributes."],
        ["Bottom-up", "Start with data elements and group them into related entities/tables."]
      ],
      questions: [
        {type:"mcq", prompt:"Which DBLC phase comes before database design?", options:["Operation","Initial study","Maintenance","Testing"], answer:1, why:"Initial study establishes the problem and scope."},
        {type:"mcq", prompt:"Which task belongs to implementation and loading?", options:["Install the DBMS and load data","List only business goals","Archive the project","Choose report colours"], answer:0, why:"That phase puts the database and its starting data in place."},
        {type:"tf", prompt:"A top-down database design approach starts by grouping individual data elements into entities.", answer:false, why:"That describes bottom-up; top-down begins with larger data sets."},
        {type:"fill", prompt:"Name the DBLC phase in which the database is tested and fine-tuned before routine use.", answers:["testing and evaluation","testing evaluation","testing & evaluation"], why:"Testing and evaluation checks the implementation against requirements."}
      ]
    }
  ],
  modules: [
    {
      id:"erd", title:"ERD studio", summary:"Build Crow’s Foot ERDs and specialization diagrams from business rules, then check each placement.",
      steps:[
        {heading:"Read the rule", body:"Mark the nouns that need stored facts, then identify verbs connecting them. Do not assume cardinality that the rule does not state."},
        {heading:"Set the ends", body:"For each relationship, ask how many of B one A can have, and how many of A one B can have. Record minimum and maximum participation separately."},
        {heading:"Resolve M:N", body:"Insert an associative entity. Its foreign keys point to both parents; choose a key that matches the stated uniqueness rule."}
      ],
      exercises:[
        {prompt:"A library needs to store each member's ID and name. Which item is an entity?", choices:["MEMBER","MemberName","Each member can borrow books"], correct:0, explanation:"MEMBER is the object type; MemberName is one of its attributes."},
        {prompt:"Each member may join several clubs; each club may have several members. Which design preserves this rule?", choices:["A MemberID field in CLUB only","A CLUB_MEMBER bridge with MemberID and ClubID","A comma-separated list of clubs in MEMBER"], correct:1, explanation:"The M:N relationship needs an associative entity and two 1:M links."},
        {prompt:"A rule says each booking belongs to exactly one guest, while a guest may make many bookings. What is the connectivity?", choices:["GUEST 1:M BOOKING","GUEST M:N BOOKING","GUEST 1:1 BOOKING"], correct:0, explanation:"One guest can have many bookings, but each booking refers to one guest."}
      ]
    },
    {
      id:"sql", title:"SQL practice", summary:"Work with the established THEMEPARKDB approach; this is a static learning exercise, not a live SQL server.",
      steps:[
        {heading:"Choose the database", body:"In MySQL Workbench, open your connection and a query tab. Run USE THEMEPARKDB; before querying the course tables. The Schemas tab shows the database and its tables."},
        {heading:"Build one clause at a time", body:"For a retrieval question, write SELECT for the columns, FROM for the table, WHERE for filtering, then ORDER BY for presentation."},
        {heading:"Check the output", body:"Use the lightning-bolt execute button. Read the Result Grid for SELECT rows and Action Output for execution status or errors."}
      ],
      exercises:[
        {prompt:"You want all ticket numbers from TICKET. Which two clauses identify the columns and table?", choices:["SELECT TICKET_NO and FROM TICKET","WHERE TICKET_NO and GROUP BY TICKET","ORDER BY TICKET_NO and JOIN TICKET"], correct:0, explanation:"SELECT names the output column; FROM names the table."},
        {prompt:"List ticket numbers and prices from TICKET, highest price first. Which clause sorts the result?", choices:["WHERE TICKET_PRICE DESC","ORDER BY TICKET_PRICE DESC","GROUP BY TICKET_PRICE DESC"], correct:1, explanation:"ORDER BY sorts rows. The sample statement above shows the full query."},
        {prompt:"After a SELECT query runs in MySQL Workbench, where should you look for its returned rows?", choices:["Result Grid","Only the Schemas list","Only the Action Output duration"], correct:0, explanation:"Result Grid displays returned rows; Action Output reports execution status and errors."}
      ],
      code:"SELECT TICKET_NO,\n       TICKET_PRICE\nFROM TICKET\nORDER BY TICKET_PRICE DESC;"
    },
    {
      id:"normalization", title:"Normalization workshop", summary:"Follow dependencies rather than memorising one final table layout.",
      steps:[
        {heading:"Make facts atomic", body:"If one cell stores several values or a report repeats groups of fields, produce one atomic fact per row before seeking 1NF."},
        {heading:"Write the key and dependencies", body:"State what uniquely identifies a row. A dependency is only valid when the business rule supports it."},
        {heading:"Separate the causes", body:"For 2NF, remove facts dependent on part of a composite key. For 3NF, remove facts dependent on another non-key fact. Show the keys and links of the resulting tables."}
      ],
      exercises:[
        {prompt:"One cell contains three phone numbers separated by commas. Which change addresses 1NF?", choices:["Store each phone number as an atomic value in a related table","Keep the comma-separated list","Make the text field longer"], correct:0, explanation:"A related table can hold one number per row instead of a multivalued cell."},
        {prompt:"A table uses (OrderID, ProductID) as its key. ProductName is determined by ProductID. What is the next useful change?", choices:["Move ProductName to PRODUCT(ProductID, ProductName)","Repeat ProductName in every order row","Remove ProductID from the key"], correct:0, explanation:"ProductName depends on only part of the composite key, so separating PRODUCT removes that partial dependency."},
        {prompt:"An ORDER row has OrderID (key), CustomerID and CustomerName. Each order has one customer, and CustomerID determines CustomerName. Which issue is present?", choices:["Transitive dependency through CustomerID","Partial dependency on OrderID","Repeating group in CustomerName"], correct:0, explanation:"OrderID determines CustomerID, which determines CustomerName. Separate CUSTOMER to remove the transitive dependency."}
      ]
    }
  ]
};
