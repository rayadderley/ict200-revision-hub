(() => {
  "use strict";

  const groups = {
    entity: "Entities",
    field: "Attributes and keys",
    end: "Crow’s Foot ends",
    line: "Relationship lines",
    category: "Subtype membership",
    bars: "Completeness",
    discriminator: "Discriminators"
  };

  const fields = (...rows) => rows;
  const tiles = {
    patient: {kind: "entity", label: "PATIENT"},
    doctor: {kind: "entity", label: "DOCTOR"},
    appointment: {kind: "entity", label: "APPOINTMENT"},
    patients: {kind: "field", rows: fields(["PK", "PatientID"], ["", "PatientName"], ["", "Phone"])},
    doctors: {kind: "field", rows: fields(["PK", "DoctorID"], ["", "DoctorName"], ["", "Specialty"])},
    appointments: {kind: "field", rows: fields(["PK", "AppointmentID"], ["FK1", "PatientID"], ["FK2", "DoctorID"], ["", "AppointmentDate"], ["", "AppointmentTime"])},
    appointmentPair: {kind: "field", rows: fields(["PK, FK1", "PatientID"], ["PK, FK2", "DoctorID"], ["", "AppointmentID"], ["", "AppointmentDate"], ["", "AppointmentTime"])},
    one: {kind: "end", label: "Exactly one", mark: "one"},
    zeroOne: {kind: "end", label: "Zero or one", mark: "zeroOne"},
    zeroMany: {kind: "end", label: "Zero or many", mark: "zeroMany"},
    oneMany: {kind: "end", label: "One or many", mark: "oneMany"},
    solid: {kind: "line", label: "Identifying", mark: "solid"},
    dashed: {kind: "line", label: "Non-identifying", mark: "dashed"},
    member: {kind: "entity", label: "MEMBER"},
    volunteer: {kind: "entity", label: "VOLUNTEER"},
    donor: {kind: "entity", label: "DONOR"},
    members: {kind: "field", rows: fields(["PK", "MemberID"], ["", "MemberName"], ["", "Phone"])},
    volunteers: {kind: "field", rows: fields(["PK, FK1", "MemberID"], ["", "InterestArea"])},
    donors: {kind: "field", rows: fields(["PK, FK1", "MemberID"], ["", "DonationMethod"])},
    separateId: {kind: "field", rows: fields(["PK", "VolunteerID"], ["FK1", "MemberID"], ["", "InterestArea"])},
    d: {kind: "category", label: "Disjoint", mark: "d"},
    o: {kind: "category", label: "Overlapping", mark: "o"},
    partial: {kind: "bars", label: "Partial completeness", mark: "partial"},
    total: {kind: "bars", label: "Total completeness", mark: "total"},
    role: {kind: "discriminator", label: "Role", names: ["Role"]},
    flags: {kind: "discriminator", label: "IsVolunteer + IsDonor", names: ["IsVolunteer", "IsDonor"]},
    subtypeId: {kind: "discriminator", label: "MemberID", names: ["MemberID"]}
  };

  const memberScenario = "A community organisation records every member’s unique ID, name and phone number. It records the main area of interest for each volunteer and a preferred donation method for each donor. For each member, the database records which roles the member has registered for.";
  const slot = (id, kind, label, hint) => ({id, kind, label, hint});
  const clinicSlots = [
    slot("leftName", "entity", "Entity that books", "Who books an appointment?"),
    slot("leftFields", "field", "Fields for the entity that books", "Look for the ID and details recorded for the person making the booking."),
    slot("centreName", "entity", "Entity between the two links", "Which record has its own ID and connects the person who books with the person who attends?"),
    slot("centreFields", "field", "Fields for the middle entity", "The same pair of people can meet again. Which key identifies each appointment on its own, and which fields reference its two parents?"),
    slot("rightName", "entity", "Entity that attends", "Who attends the appointment as the care provider?"),
    slot("rightFields", "field", "Fields for the entity that attends", "Look for the ID and details recorded for the care provider."),
    slot("booksParent", "end", "‘Books’ end at the entity that books", "For one appointment, how many patients are required?"),
    slot("booksChild", "end", "‘Books’ end at the middle entity", "For one patient, can there be no appointments? Can there be several?"),
    slot("attendsChild", "end", "‘Attends’ end at the middle entity", "For one doctor, can there be no appointments? Can there be several?"),
    slot("attendsParent", "end", "‘Attends’ end at the entity that attends", "For one appointment, how many doctors are required?"),
    slot("booksLine", "line", "‘Books’ line", "Is PatientID part of the appointment’s primary key, or only a foreign key?"),
    slot("attendsLine", "line", "‘Attends’ line", "Is DoctorID part of the appointment’s primary key, or only a foreign key?")
  ];
  const memberSlots = [
    slot("centreName", "entity", "Supertype name", "Which entity includes everyone, regardless of their role?"),
    slot("centreFields", "field", "Shared fields", "Put the unique member ID and the details shared by every member here."),
    slot("leftName", "entity", "Left subtype name", "Choose one of the two roles for this branch."),
    slot("leftFields", "field", "Left subtype fields", "Use the shared MemberID as both PK and FK1, then add the detail specific to the role on this branch."),
    slot("rightName", "entity", "Right subtype name", "Choose the other role for this branch."),
    slot("rightFields", "field", "Right subtype fields", "Use the shared MemberID as both PK and FK1, then add the detail specific to the role on this branch."),
    slot("category", "category", "Category circle", "Can a member belong to both subtypes under this policy?"),
    slot("bars", "bars", "Completeness bars", "Can a member stay on record with neither role under this policy?"),
    slot("discriminator", "discriminator", "Subtype discriminator fields", "Can the roles be selected independently, or must the member choose exactly one?")
  ];
  function specialization(id, title, policy, category, bars, discriminator, explanation) {
    const answer = {centreName: "member", centreFields: "members", category, bars, discriminator};
    return {
      id, title, type: "eerd", scenario: [memberScenario, policy], slots: memberSlots,
      palette: ["donor","member","volunteer","donors","separateId","members","volunteers","d","o","total","partial","role","subtypeId","flags"],
      answers: [
        {...answer, leftName:"volunteer", leftFields:"volunteers", rightName:"donor", rightFields:"donors"},
        {...answer, leftName:"donor", leftFields:"donors", rightName:"volunteer", rightFields:"volunteers"}
      ],
      explanation
    };
  }
  const exercises = [
    {
      id:"clinic", type:"erd", title:"Clinic appointments", slots:clinicSlots,
      scenario:["A clinic records a unique ID, name and phone number for each patient, and a unique ID, name and specialty for each doctor. Patients and doctors may be registered before they have any appointments. Each can be linked to several appointments.",
        "Each appointment has a unique appointment ID, date and time. It is booked by exactly one patient and attended by exactly one doctor. A patient can meet the same doctor again."],
      palette:["doctor","appointment","patient","doctors","appointments","patients","appointmentPair","zeroOne","oneMany","one","zeroMany","solid","dashed"],
      answers:[{
        leftName:"patient", leftFields:"patients", centreName:"appointment", centreFields:"appointments",
        rightName:"doctor", rightFields:"doctors", booksParent:"one", booksChild:"zeroMany",
        attendsChild:"zeroMany", attendsParent:"one", booksLine:"dashed", attendsLine:"dashed"
      }],
      explanation:"Each appointment refers to exactly one patient and one doctor. Each parent may have zero or many appointments. Both links are dashed because PatientID and DoctorID are foreign keys outside the AppointmentID primary key."
    },
    specialization("roles", "Organisation membership",
      "A member may be a volunteer, a donor, both, or neither. Members with neither role stay on record.",
      "o", "partial", "flags", "The o circle permits both roles. One horizontal bar permits a member with neither role. IsVolunteer and IsDonor record the two independent choices."),
    specialization("one-role", "Policy A · Exactly one role",
      "Every member must register as either a volunteer or a donor. A member cannot register for both.",
      "d", "total", "role", "The d circle rules out both roles and two horizontal bars rule out neither. The required Role field holds VOLUNTEER or DONOR."),
    specialization("at-least-one", "Policy B · At least one role",
      "Every member must register for at least one role. A member may register as both a volunteer and a donor.",
      "o", "total", "flags", "The o circle permits both roles and two horizontal bars require at least one. At least one of IsVolunteer and IsDonor must be Yes.")
  ];

  const attempts = new Map();
  let active = exercises[0].id;

  function evaluate(exercise, placed) {
    const score = answer => exercise.slots.filter(({id}) => placed[id] === answer[id]).length;
    const expected = exercise.answers.reduce((best, answer) => score(answer) > score(best) ? answer : best);
    return exercise.slots.map(spec => ({
      ...spec, state: placed[spec.id] === expected[spec.id] ? "correct" : placed[spec.id] ? "revise" : "missing"
    }));
  }

  function mount(parent, {completed, saveComplete}) {
    const el = (tag, className, value) => {
      const element = document.createElement(tag);
      if (className) element.className = className;
      if (value !== undefined) element.textContent = value;
      return element;
    };
    const button = (className, label) => {
      const element = el("button", className, label);
      element.type = "button";
      return element;
    };
    const container = el("section", "card card-pad erd-builder");
    const heading = el("h2", null, "Build the diagram");
    heading.id = "erd-builder-heading";
    container.setAttribute("aria-labelledby", heading.id);
    const nav = el("div", "erd-exercise-list");
    nav.setAttribute("role", "group");
    nav.setAttribute("aria-label", "Diagram exercises");
    const workspace = el("div", "erd-workspace");
    container.append(heading, nav, workspace);
    parent.append(container);

    function openExercise() {
      const exercise = exercises.find(item => item.id === active);
      if (!attempts.has(active)) attempts.set(active, {});
      const placed = attempts.get(active);
      const specs = new Map(exercise.slots.map(item => [item.id, item]));
      const slotButtons = new Map();
      const paletteButtons = new Map();
      let selectedTile = "";
      let selectedSlot = "";
      let currentGroup = "entity";
      let dragging = "";
      let outcome = [];
      let updateBranchLabels = () => {};

      workspace.replaceChildren();
      const title = el("h3", "erd-title", exercise.title);
      const scenario = el("div", "erd-scenario");
      exercise.scenario.forEach(paragraph => scenario.append(el("p", null, paragraph)));
      const instructions = el("p", "muted", "Drag a tile to its place on the diagram. You can also select a tile, then its slot, using a tap or Enter. Select a slot first to see the tiles that fit there.");
      const palette = el("section", "erd-palette");
      palette.append(el("h4", null, "Tiles"));
      const groupNav = el("div", "erd-tool-row");
      const groupButtons = new Map();
      const availableGroups = Object.keys(groups).filter(kind => exercise.palette.some(id => tiles[id].kind === kind));
      groupNav.setAttribute("role", "group");
      groupNav.setAttribute("aria-label", "Tile categories");
      availableGroups.forEach(kind => {
        const filter = button("erd-filter", groups[kind]);
        filter.addEventListener("click", () => {
          if (selectedSlot && specs.get(selectedSlot).kind !== kind) selectedSlot = "";
          if (selectedTile && tiles[selectedTile].kind !== kind) selectedTile = "";
          currentGroup = kind;
          update();
        });
        groupButtons.set(kind, filter);
        groupNav.append(filter);
      });
      const paletteContent = el("div", "erd-tiles");
      const targetActions = el("div", "erd-tool-row erd-target-actions");
      const toSlot = button("button secondary", "Go to a slot");
      const clear = button("button ghost", "Clear selected slot");
      const selection = el("p", "erd-selection");
      selection.setAttribute("role", "status");
      targetActions.append(toSlot, clear);
      palette.append(groupNav, paletteContent, targetActions, selection);
      const board = el("div", "erd-board " + (exercise.type === "erd" ? "erd-board-relations" : "erd-board-hierarchy"));
      board.setAttribute("role", "group");
      board.setAttribute("aria-label", "Diagram");
      const controls = el("div", "button-row");
      const check = button("button", "Check my diagram");
      const reset = button("button secondary", "Reset diagram");
      const feedback = el("div", "erd-feedback");
      feedback.hidden = true;
      feedback.setAttribute("role", "status");
      controls.append(check, reset);
      workspace.append(title, scenario, instructions, palette, board, controls, feedback);

      function tileLabel(tile) {
        return tile.label || tile.rows.map(([key, name]) => key ? key + " " + name : name).join(", ");
      }
      function tileContent(element, tile, visualOnly = false) {
        if (tile.mark) element.append(makeSymbol(tile.mark));
        if (tile.rows || (tile.names && visualOnly)) {
          const rows = tile.rows || tile.names.map(name => ["", name]);
          rows.forEach(([key, name]) => {
            const row = el("span", "erd-field" + (key.includes("PK") ? " erd-pk" : ""));
            if (key) row.append(el("small", "erd-key-tag", key));
            row.append(el("span", "erd-field-name", name));
            element.append(row);
          });
        } else if (!visualOnly || !tile.mark) {
          element.append(el("span", "erd-tile-label", tile.label));
        }
      }
      function place(spec, tileId) {
        if (!exercise.palette.includes(tileId) || tiles[tileId].kind !== spec.kind) {
          selection.textContent = "Choose a " + groups[spec.kind].toLowerCase() + " tile for this slot.";
          return false;
        }
        // Names represent distinct entities. Move a name if it already appears on the board.
        if (spec.kind === "entity") {
          const previous = Object.keys(placed).find(id => id !== spec.id && placed[id] === tileId);
          if (previous) delete placed[previous];
        }
        placed[spec.id] = tileId;
        selectedTile = "";
        selectedSlot = "";
        clearFeedback();
        update(tileLabel(tiles[tileId]) + " placed. " + Object.keys(placed).length + " of " + exercise.slots.length + " slots filled.");
        return true;
      }
      function addSlot(id, className, placeholder) {
        const spec = specs.get(id);
        const target = button("erd-slot " + className);
        target.dataset.slot = id;
        target.addEventListener("click", () => {
          if (selectedTile && tiles[selectedTile].kind === spec.kind) {
            place(spec, selectedTile);
          } else {
            selectedTile = "";
            if (selectedSlot === id) selectedSlot = "";
            else selectedSlot = id;
            currentGroup = spec.kind;
            update();
            if (selectedSlot) focusTiles();
          }
        });
        target.addEventListener("dragover", event => {
          if (dragging && tiles[dragging].kind === spec.kind) {
            event.preventDefault();
            event.dataTransfer.dropEffect = "copy";
            target.classList.add("erd-drop-hover");
          }
        });
        target.addEventListener("dragleave", event => {
          if (!target.contains(event.relatedTarget)) target.classList.remove("erd-drop-hover");
        });
        target.addEventListener("drop", event => {
          event.preventDefault();
          target.classList.remove("erd-drop-hover");
          if (dragging && place(spec, dragging)) target.focus({preventScroll:true});
        });
        slotButtons.set(id, {target, placeholder});
        return target;
      }
      function entity(prefix, style, discriminator = false) {
        const card = el("div", "erd-entity " + style);
        card.append(addSlot(prefix + "Name", "erd-name-slot", "Entity name"), addSlot(prefix + "Fields", "erd-field-slot", "Attributes and keys"));
        if (discriminator) card.append(addSlot("discriminator", "erd-field-slot", "Discriminator fields"));
        return card;
      }
      if (exercise.type === "erd") {
        function link(verb, from, to, label = verb) {
          const connector = el("div", "erd-connector");
          const row = el("div", "erd-link-row");
          const line = addSlot(verb + "Line", "erd-line-slot", "Line");
          row.append(addSlot(from, "erd-end-slot erd-first-end", "End"),
            line, addSlot(to, "erd-end-slot erd-last-end", "End"));
          connector.append(el("span", "erd-verb", label), row);
          return connector;
        }
        board.append(entity("left", ""), link("books", "booksParent", "booksChild"), entity("centre", ""),
          link("attends", "attendsChild", "attendsParent", "is attended by"), entity("right", ""));
      } else {
        const hierarchy = el("div", "erd-hierarchy");
        const categoryRow = el("div", "erd-category-row");
        const leftLabel = el("span", "erd-discriminator-label");
        const rightLabel = el("span", "erd-discriminator-label");
        categoryRow.append(leftLabel, addSlot("category", "erd-category-slot", "Circle"), rightLabel);
        const branch = el("div", "erd-branch");
        branch.setAttribute("aria-hidden", "true");
        const subtypes = el("div", "erd-subtypes");
        const voluntaryRole = el("span", "erd-role-value");
        const donorRole = el("span", "erd-role-value");
        const left = entity("left", "erd-subtype");
        const right = entity("right", "erd-subtype");
        left.prepend(voluntaryRole);
        right.prepend(donorRole);
        subtypes.append(left,right);
        hierarchy.append(entity("centre", "erd-supertype", true), el("div", "erd-stem"), categoryRow,
          addSlot("bars", "erd-bars-slot", "Bars"), branch, subtypes);
        board.append(hierarchy);
        updateBranchLabels = () => {
          const name = side => placed[side + "Name"];
          const flag = side => name(side) === "volunteer" ? "IsVolunteer" : name(side) === "donor" ? "IsDonor" : "";
          leftLabel.textContent = placed.discriminator === "flags" ? flag("left") : "";
          rightLabel.textContent = placed.discriminator === "flags" ? flag("right") : placed.discriminator ? tiles[placed.discriminator].label : "";
          const role = side => placed.discriminator === "role" && ["volunteer","donor"].includes(name(side)) ? "Role = " + tiles[name(side)].label : "";
          voluntaryRole.textContent = role("left");
          donorRole.textContent = role("right");
        };
      }
      exercise.palette.forEach(id => {
        const tile = tiles[id];
        const piece = button("erd-tile");
        piece.draggable = true;
        piece.dataset.tile = id;
        piece.setAttribute("aria-label", tileLabel(tile));
        tileContent(piece, tile);
        piece.addEventListener("click", () => {
          if (selectedSlot) {
            const targetId = selectedSlot;
            if (place(specs.get(targetId), id)) slotButtons.get(targetId).target.focus();
            return;
          }
          selectedTile = selectedTile === id ? "" : id;
          update();
        });
        piece.addEventListener("dragstart", event => {
          dragging = id;
          event.dataTransfer.setData("text/plain", id);
          event.dataTransfer.effectAllowed = "copy";
        });
        piece.addEventListener("dragend", () => {
          dragging = "";
          slotButtons.forEach(({target}) => target.classList.remove("erd-drop-hover"));
        });
        paletteButtons.set(id, piece);
        paletteContent.append(piece);
      });

      function update(message) {
        groupButtons.forEach((element, kind) => element.setAttribute("aria-pressed", String(kind === currentGroup)));
        paletteButtons.forEach((piece, id) => {
          piece.hidden = tiles[id].kind !== currentGroup;
          piece.setAttribute("aria-pressed", String(selectedTile === id));
        });
        slotButtons.forEach(({target, placeholder}, id) => {
          const spec = specs.get(id);
          const tile = tiles[placed[id]];
          const result = outcome.find(item => item.id === id);
          target.replaceChildren();
          if (tile) tileContent(target, tile, true);
          else target.append(el("span", null, placeholder));
          target.dataset.filled = String(Boolean(tile));
          target.dataset.result = result?.state || "";
          target.setAttribute("aria-pressed", String(selectedSlot === id));
          target.setAttribute("aria-label", spec.label + ": " + (tile ? tileLabel(tile) : "empty") + (result ? ". " + result.state : ""));
          target.classList.toggle("erd-accepts", Boolean(selectedTile && tiles[selectedTile].kind === spec.kind));
          if (result) target.append(el("small", "erd-slot-status", {correct:"Correct", revise:"Retry", missing:"Missing"}[result.state]));
        });
        updateBranchLabels();
        clear.disabled = !selectedSlot || !placed[selectedSlot];
        toSlot.disabled = !selectedTile;
        selection.textContent = message || (selectedSlot ? "Selected slot: " + specs.get(selectedSlot).label :
          selectedTile ? "Selected tile: " + tileLabel(tiles[selectedTile]) + ". Choose a highlighted slot." :
            Object.keys(placed).length + " of " + exercise.slots.length + " slots filled.");
      }
      function clearFeedback() {
        outcome = [];
        feedback.replaceChildren();
        feedback.hidden = true;
      }
      function focusTiles() {
        [...paletteButtons.values()].find(piece => !piece.hidden)?.focus();
      }
      toSlot.addEventListener("click", () => {
        (board.querySelector(".erd-accepts[data-filled='false']") || board.querySelector(".erd-accepts"))?.focus();
      });
      clear.addEventListener("click", () => {
        const target = slotButtons.get(selectedSlot).target;
        delete placed[selectedSlot];
        clearFeedback();
        update("Slot cleared. Choose a tile to try again.");
        target.focus();
      });
      reset.addEventListener("click", () => {
        Object.keys(placed).forEach(id => delete placed[id]);
        selectedTile = "";
        selectedSlot = "";
        currentGroup = "entity";
        clearFeedback();
        update("Diagram cleared.");
      });
      check.addEventListener("click", () => {
        outcome = evaluate(exercise, placed);
        const remaining = outcome.filter(item => item.state !== "correct");
        const right = outcome.length - remaining.length;
        feedback.replaceChildren(el("strong", null, right + " of " + outcome.length + " placements correct."));
        feedback.className = "erd-feedback feedback " + (remaining.length ? "bad" : "good");
        feedback.hidden = false;
        if (remaining.length) {
          const list = el("ul", "erd-feedback-list");
          remaining.forEach(item => {
            const entry = el("li");
            entry.append(el("b", null, item.label + " · " + (item.state === "missing" ? "Missing" : "Retry")),
              el("span", null, item.hint));
            list.append(entry);
          });
          feedback.append(list);
        } else {
          feedback.append(el("p", null, exercise.explanation));
          saveComplete(exercise.id);
          updateNav();
        }
        update();
      });
      update();
    }

    const buttons = exercises.map(exercise => {
      const option = button("erd-filter");
      option.addEventListener("click", () => {
        active = exercise.id;
        updateNav();
        openExercise();
      });
      nav.append(option);
      return [exercise, option];
    });
    function updateNav() {
      buttons.forEach(([exercise, option]) => {
        option.textContent = exercise.title + (completed(exercise.id) ? " ✓" : "");
        option.setAttribute("aria-pressed", String(exercise.id === active));
        option.setAttribute("aria-label", exercise.title + (completed(exercise.id) ? ", completed" : ""));
      });
    }
    updateNav();
    openExercise();
  }

  function makeSymbol(mark) {
    const ns = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(ns, "svg");
    svg.setAttribute("viewBox", "0 0 52 26");
    svg.setAttribute("class", "erd-symbol");
    svg.setAttribute("aria-hidden", "true");
    function draw(tag, attrs) {
      const shape = document.createElementNS(ns, tag);
      Object.entries(attrs).forEach(([key, value]) => shape.setAttribute(key, value));
      svg.append(shape);
      return shape;
    }
    const line = (d, dashed = false) => draw("path", {d, fill:"none", stroke:"currentColor", "stroke-width":2,
      "stroke-linecap":"round", ...(dashed ? {"stroke-dasharray":"6 5"} : {})});
    if (mark === "solid" || mark === "dashed") {
      line("M2 13H50", mark === "dashed");
    } else if (mark === "d" || mark === "o") {
      draw("circle", {cx:26, cy:13, r:11, fill:"white", stroke:"currentColor", "stroke-width":2});
      draw("text", {x:26, y:17, "text-anchor":"middle", fill:"currentColor", "font-size":14, "font-weight":700}).textContent = mark;
    } else if (mark === "partial" || mark === "total") {
      line(mark === "total" ? "M10 9H42 M10 17H42" : "M10 13H42");
    } else {
      line("M4 13H49");
      if (mark === "zeroOne" || mark === "zeroMany") {
        draw("circle", {cx:21, cy:13, r:5, fill:"white", stroke:"currentColor", "stroke-width":2});
      } else {
        line("M21 6V20");
      }
      if (mark === "zeroMany" || mark === "oneMany") line("M49 5L34 13L49 21");
      else line("M37 6V20");
    }
    return svg;
  }

  window.ICT200_ERD = {exercises, mount};
})();
