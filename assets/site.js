'use strict';
const examples = {
  "workflow": {
    "file": "workflow.acl",
    "description": "A workflow connects executors and named artifacts. Outcome routes make review feedback explicit; iteration limits bound that feedback loop.",
    "code": "workflow \"coding\" {\n  max_transitions = 20\n\n  stage \"build\" {\n    executor = agent.builder\n    inputs   = [\"SPEC.md\", \"PLAN.md\"]\n    outputs  = { findings = \"BUILD.md\" }\n  }\n\n  stage \"review\" {\n    executor = agent.reviewer\n    inputs   = [stage.build.outputs.findings]\n    on \"changes-required\" {\n      return_to      = stage.build.name\n      max_iterations = 2\n    }\n    on \"success\" { return_to = \"end\" }\n  }\n}"
  },
  "agent": {
    "file": "agents.acl",
    "description": "An agent declares its image, model, instructions, and callable capabilities. Required gates describe what must pass before its work is accepted.",
    "code": "agent \"builder\" {\n  identity = \"team-builder\"\n  provider = var.provider\n  model    = var.model\n  prompt   = file(\"prompts/build.md\")\n\n  container {\n    image       = var.builder_image\n    command     = [\"/agent\"]\n    working_dir = \"/workspace\"\n    workspace   = \"write\"\n    network     = \"bridge\"\n  }\n\n  tool \"test\" {\n    command {\n      argv        = [\"go\", \"test\", \"./...\"]\n      working_dir = \"/workspace\"\n    }\n  }\n  gate \"tests-pass\" {\n    tool = \"test\"\n    expect { exit_code = 0 }\n  }\n}"
  },
  "modules": {
    "file": "watts.acl",
    "description": "Local modules reuse a package or selected declarations. Typed variables customize it; an entrypoint selects the workflow to compile.",
    "code": "package \"team-go\" {\n  version    = \"0.1.0\"\n  entrypoint = module.coder.workflow.coding\n}\n\nvariable \"model\" {\n  type    = string\n  default = \"team/default-model\"\n}\n\nmodule \"coder\" {\n  source  = \"./modules/coder\"\n  version = \"0.1.0\"\n  variables = {\n    model = var.model\n  }\n}"
  }
};
const tabs = Array.from(document.querySelectorAll('[role="tab"]'));
function selectTab(tab, focus = false) {
  const example = examples[tab.dataset.example];
  tabs.forEach(item => {
    item.setAttribute('aria-selected', String(item === tab));
    item.tabIndex = item === tab ? 0 : -1;
  });
  document.getElementById('language-code').textContent = example.code;
  document.getElementById('code-filename').textContent = example.file;
  document.getElementById('example-description').textContent = example.description;
  document.getElementById('language-panel').setAttribute('aria-labelledby', tab.id);
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
