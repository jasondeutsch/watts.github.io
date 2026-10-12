'use strict';
const examples = {
  agent: {
    file: 'agent.yaml',
    description: 'An Agent combines a container runtime with model configuration, instructions, tools, and completion gates.',
    code: document.getElementById('manifest-code').textContent
  },
  procedure: {
    file: 'procedure.yaml',
    description: 'A Procedure declares model-free execution. Use it for deterministic work, with the same workload boundary and retained evidence.',
    code: 'kind: Procedure\nschema_version: 1\nname: regression-tests\nspec:\n  execution: {type: container}\n  container:\n    image: golang:1.27\n    command: [go, test, ./...]\n    result: exit-code'
  },
  resources: {
    file: 'configmap.yaml',
    description: 'ConfigMap and Secret resources supply reusable configuration and scoped credential references. Keep provider credentials out of published packages.',
    code: 'kind: ConfigMap\nschema_version: 1\nname: team-context\nspec:\n  data:\n    instructions: |\n      Preserve existing public interfaces.\n      Include regression tests for fixes.\n      Report unresolved findings explicitly.'
  }
};
const tabs = Array.from(document.querySelectorAll('[role="tab"]'));
function selectTab(tab, focus = false) {
  const example = examples[tab.dataset.kind];
  tabs.forEach(item => {
    item.setAttribute('aria-selected', String(item === tab));
    item.tabIndex = item === tab ? 0 : -1;
  });
  document.getElementById('manifest-code').textContent = example.code;
  document.getElementById('code-filename').textContent = example.file;
  document.getElementById('kind-description').textContent = example.description;
  document.getElementById('manifest-panel').setAttribute('aria-labelledby', tab.id);
  if (focus) tab.focus();
}
tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectTab(tab));
  tab.addEventListener('keydown', event => {
    let next;
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
    if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = tabs.length - 1;
    if (next !== undefined) {
      event.preventDefault();
      selectTab(tabs[next], true);
    }
  });
});
