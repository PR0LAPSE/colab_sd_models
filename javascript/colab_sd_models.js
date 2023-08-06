document.addEventListener('DOMContentLoaded', () => {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.addedNodes) {
        mutation.addedNodes.forEach((node) => {
          if (node.id === 'tab_models_list') {
            // запуск кода после загрузки элементов
            const models_checkbox_grids = document.querySelectorAll("#tab_models_list fieldset > div[data-testid='checkbox-group']");
            models_checkbox_grids.forEach(models_checkbox_grid => {
              const model_label = models_checkbox_grid.querySelectorAll('label');
              const numColumns = model_label.length > 9 ? 'repeat(auto-fit, minmax(250px, 1fr))' : '1fr';
              models_checkbox_grid.style.gridTemplateColumns = numColumns;
            });
            const intervalId = setInterval(() => {
              const modelsNavButtons = document.querySelectorAll("div#tab_models_list > div.gap > div.tabs > div.tab-nav > button");
              const MaleCat = Array.from(modelsNavButtons).find(button => button.textContent.includes('мужские'));
              if (MaleCat) {
                MaleCat.setAttribute("id", "male_only");
              }
            }, 100);
            const freespacetextarea = document.querySelector("#free_space_area > label > textarea");
            const frespace_out = document.querySelector("#frespace_out");
            let prevValue = freespacetextarea.value;
            setInterval(function () {
              const currentValue = freespacetextarea.value;
              if (currentValue !== prevValue) {
                frespace_out.innerHTML = `${currentValue}`;
                prevValue = currentValue;
              }
            }, 100);
            const freespace_getButton = document.querySelector("#freespace_get");
            const free_spaceOrigButton = document.querySelector("#free_space_button");
            freespace_getButton.addEventListener("click", function () {
              free_spaceOrigButton.click();
            });
            const SearchBlock = document.querySelector('#clear_search_models_results').closest('label').closest('div').closest('div').closest('div');
            const ModelDLHeaderBlock = document.querySelector('.models_dl_header').closest('div').parentNode.closest('div').closest('div');
            const ModelDLHeaderContainer = document.querySelector('.models_dl_header').closest('div').parentNode;
            ModelDLHeaderBlock.appendChild(SearchBlock);
            ModelDLHeaderContainer.style.cssText = `display: flex; flex-direction: row; align-items: center; justify-content: flex-start; flex-wrap: wrap;`;
            document.querySelector('.models_dl_header').parentNode.style.marginRight = "50px";
            const searchInput = document.querySelector('input[type="text"]');
            const findedModels = document.querySelector('#finded_models');
            const tabModelsList = document.querySelector('#tab_models_list');
            const labels = tabModelsList.querySelectorAll('label');
            const clearSearchResultsButton = document.querySelector("#clear_search_models_results");
            searchInput.addEventListener('input', (event) => {
              const searchTerm = event.target.value.toLowerCase();
              findedModels.innerHTML = '';
              if (searchTerm !== '') {
                labels.forEach((label) => {
                  const labelText = label.textContent.toLowerCase();
                  if (labelText.includes(searchTerm)) {
                    const clone = label.cloneNode(true);
                    findedModels.appendChild(clone);
                    const originalCheckbox = label.querySelector('input[type="checkbox"]');
                    const clonedCheckbox = clone.querySelector('input[type="checkbox"]');
                    clonedCheckbox.addEventListener('change', () => {
                      originalCheckbox.click();
                    });
                  }
                });
              }
            });
            clearSearchResultsButton.addEventListener('click', () => {
              findedModels.innerHTML = '';
              searchInput.value = '';
            });
            setTimeout(() => document.querySelector("#files_button").click(), 1000);
            setTimeout(() => document.querySelector("#free_space_button").click(), 1000);
            //файловый менеджер на тексбоксах
            setTimeout(() => {
              const filesArea = document.querySelector("#files_area > label > textarea");
              const filesCheckbox = document.querySelector("#files_checkbox");
              const deleteArea = document.querySelector("#delete_area > label > textarea");
              function addCheckboxEventListeners() {
                const delete_checkboxes = document.querySelectorAll("#files_checkbox > label > input[type=checkbox]");
                delete_checkboxes.forEach(checkbox => {
                  checkbox.addEventListener("change", event => {
                    const delete_span = event.target.parentElement.querySelector("span");
                    if (event.target.checked) {
                      delete_span.style.textDecoration = "line-through";
                      delete_span.style.color = "#ed5252";
                    } else {
                      delete_span.style.textDecoration = "none";
                      delete_span.style.color = "";
                    }
                  });
                });
              }
              function updateCheckboxes() {
                while (filesCheckbox.firstChild) {
                  filesCheckbox.removeChild(filesCheckbox.firstChild);
                }
                const fileNames = filesArea.value.split("\n").map(path => path.split("/").pop());
                if (fileNames.length === 0 || (fileNames.length === 1 && fileNames[0] === "")) {
                  const message = document.createElement("p");
                  message.textContent = "ничего не найдено";
                  filesCheckbox.appendChild(message);
                } else {
                  fileNames.forEach(fileName => {
                    const checkbox = document.createElement("input");
                    checkbox.type = "checkbox";
                    checkbox.id = fileName;
                    checkbox.addEventListener("change", event => {
                      if (event.target.checked) {
                        deleteArea.value += (deleteArea.value ? "\n" : "") + fileName;
                      } else {
                        const lines = deleteArea.value.split("\n");
                        const index = lines.indexOf(fileName);
                        if (index !== -1) {
                          lines.splice(index, 1);
                          deleteArea.value = lines.join("\n");
                        }
                      }
                      deleteArea.dispatchEvent(new Event('input')); // имитация ввода, это самая важная часть кода
                    });
                    const label = document.createElement("label");
                    label.htmlFor = fileName;
                    label.className = "filecheckbox";
                    const span = document.createElement("span");
                    span.textContent = fileName;
                    label.appendChild(checkbox);
                    label.appendChild(span);
                    filesCheckbox.appendChild(label);
                  });
                }
                deleteArea.value = deleteArea.value.trim();
                deleteArea.dispatchEvent(new Event('input')); // имитация ввода, это самая важная часть кода
                addCheckboxEventListeners()
              }
              const observer = new MutationObserver(updateCheckboxes);
              observer.observe(filesArea, { characterData: true, subtree: true });
              updateCheckboxes();
              const RefreshFilesButton = document.querySelector("#refresh_files_button");
              RefreshFilesButton.addEventListener("click", () => {
				document.querySelector("#files_button").click();
                setTimeout(function () { updateCheckboxes(); }, 3000);
              });
              document.querySelector("#delete_button").addEventListener("click", function () {
                setTimeout(function () {
                  document.querySelector("#files_button").click();
                  setTimeout(function () { updateCheckboxes(); }, 3000);

                }, 3000);
              });
              const OrigDelButton = document.querySelector("#delete_button");
              const CustomDelButton = document.querySelector("#delete_files_button");
              CustomDelButton.addEventListener("click", () => {
                OrigDelButton.click();
              });
			setInterval(function() {
				var DLresultText = document.querySelector("#downloads_result_text > span.finish_dl_func");
				DLresultText.textContent = document.querySelector("#dlresultbox > label > textarea").value;
				function checkDLresult(element, text) {
				if (element.textContent.includes(text)) {
					document.querySelector("div.downloads_result_container > div.models_porgress_loader").style.removeProperty("display");
					document.querySelector("#downloads_start_text").style.removeProperty("display");
					document.querySelector("#downloads_result_text > span.dl_progress_info").textContent = "чтобы новые файлы появились в выпадающем списке моделей, нужно обновить их список по соответсвующей кнопке";
				}
			}
			checkDLresult(DLresultText, "заверш");
			}, 200);
			document.querySelector("#general_download_button").addEventListener("click", function() {
				var resultTextareaDL = document.querySelector("#dlresultbox > label > textarea");
				resultTextareaDL.value = "";
				var resultClearOut = new Event("input", { bubbles: true });
				resultTextareaDL.dispatchEvent(resultClearOut);
				const DLprogressBar = document.querySelector("div.downloads_result_container > div.models_porgress_loader");
				DLprogressBar.style.setProperty("display", "block", "important");
				const DLresultText = document.querySelector("#downloads_result_text");
				DLresultText.style.setProperty("display", "block", "important");
				document.querySelector("#downloads_start_text").style.setProperty("display", "block", "important");
				document.querySelector("#ownlinks_download_button").click();
				setTimeout(function() {
					document.querySelector("#checkboxes_download_button").click();
				}, 3000);
			});
            }, 9000);
          }
        });
      }
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });
});
