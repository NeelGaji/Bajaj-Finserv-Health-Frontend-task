fetch("https://raw.githubusercontent.com/dixitsoham7/dixitsoham7.github.io/main/index.json")
  .then((response) => response.json())
  .then((data) => {
    const employees = data.employees;
    const table = document.getElementById("jsonTable");
    const searchInput = document.getElementById("searchInput");
    const skillsContainer = document.createElement("div");

    const headerRow = document.createElement("tr");

    const keys = Object.keys(employees[0]);

    keys.forEach((key) => {
      const th = document.createElement("th");
      th.textContent = key.toUpperCase();
      headerRow.appendChild(th);
    });

    function populateSkillsFilter() {
      const skillsSet = new Set();

      employees.forEach((employee) => {
        const skills = employee.skills;
        if (skills) {
          skills.forEach((skill) => skillsSet.add(skill));
        }
      });

      skillsContainer.innerHTML = "";

      skillsSet.forEach((skill) => {
        // Create checkbox element
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.value = skill;
        checkbox.addEventListener("change", filterTable); // Add event listener to trigger filtering on checkbox change

        // Create label element for checkbox
        const label = document.createElement("label");
        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(skill));

        // Append the label to the skills container
        skillsContainer.appendChild(label);
      });

      // Append the skills container above the table
      table.parentNode.insertBefore(skillsContainer, table);
    }

    function filterTable() {
        const searchValue = searchInput.value.toLowerCase();
        const checkboxes = Array.from(skillsContainer.querySelectorAll("input[type='checkbox']"));
        const checkedSkills = checkboxes.filter((checkbox) => checkbox.checked).map((checkbox) => checkbox.value.toLowerCase());
      
        table.innerHTML = "";
      
        table.appendChild(headerRow);
      
        employees.forEach((employee) => {
          const name = employee.name ? employee.name.toLowerCase() : "";
          const skills = employee.skills ? employee.skills.map((skill) => skill.toLowerCase()) : [];
      
          if (
            (name.includes(searchValue) || searchValue === "") &&
            (checkedSkills.length === 0 || checkedSkills.some((skill) => skills.includes(skill)))
          ) {
            const row = document.createElement("tr");
      
            keys.forEach((key) => {
              const cell = document.createElement("td");
              if (key === "projects") {
                const projects = employee[key];
                if (projects) {
                  const projectNames = projects.map((project) => project.name).join(", ");
                  const numTasks = projects.reduce(
                    (total, project) => total + (project.tasks ? project.tasks.length : 0),
                    0
                  );
                  cell.innerHTML = `<strong>${projectNames}</strong><br>Tasks: ${numTasks}<br>Projects: ${projects.length}`;
                } else {
                  cell.textContent = "NA";
                }
              } else {
                cell.textContent = employee[key];
              }
              row.appendChild(cell);
            });
      
            table.appendChild(row);
          }
        });
      }
      

    searchInput.addEventListener("input", filterTable);

    filterTable();

    populateSkillsFilter();
  })
  .catch((error) => {
    console.log("Error:", error);
  });
