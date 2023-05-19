fetch('https://raw.githubusercontent.com/dixitsoham7/dixitsoham7.github.io/main/index.json')
      .then(response => response.json())
      .then(data => {
        const employees = data.employees;
        const table = document.getElementById('jsonTable');
        const searchInput = document.getElementById('searchInput');
        const skillsFilter = document.getElementById('skillsFilter');

       
        const headerRow = document.createElement('tr');

        
        const keys = Object.keys(employees[0]);

        keys.forEach(key => {
          const th = document.createElement('th');
          th.textContent = key;
          headerRow.appendChild(th);
        });

        table.appendChild(headerRow);

        
        function populateSkillsFilter() {
          const skillsSet = new Set();

          employees.forEach(employee => {
            const skills = employee.skills;
            if (skills) {
              skills.forEach(skill => skillsSet.add(skill));
            }
          });

          skillsFilter.innerHTML = '';
          const allOption = document.createElement('option');
          allOption.value = '';
          allOption.textContent = 'All';
          skillsFilter.appendChild(allOption);

          skillsSet.forEach(skill => {
            const option = document.createElement('option');
            option.value = skill;
            option.textContent = skill;
            skillsFilter.appendChild(option);
          });
        }

        
        function filterTable() {
          const searchValue = searchInput.value.toLowerCase();
          const skillsValue = skillsFilter.value.toLowerCase();

          // Clear table body
          table.innerHTML = '';

          
          table.appendChild(headerRow);

          employees.forEach(employee => {
            const name = employee.name ? employee.name.toLowerCase() : '';
            const skills = employee.skills ? employee.skills.map(skill => skill.toLowerCase()) : [];

            if ((name.includes(searchValue) || searchValue === '') &&
                (skills.includes(skillsValue) || skillsValue === '')) {
              const row = document.createElement('tr');

              keys.forEach(key => {
                const cell = document.createElement('td');
                if (key === 'projects') {
                  const projects = employee[key];
                  if (projects) {
                    const projectNames = projects.map(project => project.name).join(', ');
                    const numTasks = projects.reduce((total, project) => total + (project.tasks ? project.tasks.length : 0), 0);
                    cell.innerHTML = `<strong>${projectNames}</strong><br>Tasks: ${numTasks}<br>Projects: ${projects.length}`;
                  } else {
                    cell.textContent = 'N/A';
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

        
        searchInput.addEventListener('input', filterTable);
        skillsFilter.addEventListener('change', filterTable);

        
        filterTable();

        
        populateSkillsFilter();
      })
      .catch(error => {
        console.log('Error:', error);
      });
