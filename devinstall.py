import os
import shutil

# Change directory to the user's home directory
os.chdir(os.path.expanduser("~"))

# Print the current working directory
print("Current working directory:", os.getcwd())

# Define paths
src_base = os.path.join("Documents", "workspace", "microting", "eform-angular-insight-dashboard-plugin")
dst_base = os.path.join("Documents", "workspace", "microting", "eform-angular-frontend")

# List of files and directories to remove
files_to_remove = [
    os.path.join("eform-client", "src", "app", "plugins", "modules", "insight-dashboard-pn"),
    os.path.join("eform-client", "e2e", "Tests", "insight-dashboard-settings"),
    os.path.join("eform-client", "e2e", "Tests", "insight-dashboard-general"),
    os.path.join("eform-client", "e2e", "Page objects", "InsightDashboard"),
    os.path.join("eform-client", "wdio-plugin-step2a.conf.ts"),
    os.path.join("eform-client", "wdio-plugin-step2b.conf.ts"),
    os.path.join("eform-client", "wdio-plugin-step2c.conf.ts"),
    os.path.join("eform-client", "wdio-plugin-step2d.conf.ts"),
    os.path.join("eform-client", "wdio-plugin-step2e.conf.ts"),
    os.path.join("eform-client", "wdio-plugin-step2f.conf.ts"),
    os.path.join("eform-client", "wdio-plugin-step2g.conf.ts"),
    os.path.join("eFormAPI", "Plugins", "InsightDashboard.Pn"),
]

# Remove the files and directories
for rel_path in files_to_remove:
    full_path = os.path.join(dst_base, rel_path)
    if os.path.exists(full_path):
        if os.path.isdir(full_path):
            shutil.rmtree(full_path)
        else:
            os.remove(full_path)

# Ensure directories exist
cypress_plugins_dir = os.path.join(dst_base, "eform-client", "cypress", "e2e", "plugins")
os.makedirs(cypress_plugins_dir, exist_ok=True)
plugins_dir = os.path.join(dst_base, "eFormAPI", "Plugins")
os.makedirs(plugins_dir, exist_ok=True)

# List of files and directories to copy
files_to_copy = [
    (os.path.join("eform-client", "src", "app", "plugins", "modules", "insight-dashboard-pn"),
     os.path.join("eform-client", "src", "app", "plugins", "modules", "insight-dashboard-pn")),
    (os.path.join("eform-client", "e2e", "Tests", "insight-dashboard-settings"),
     os.path.join("eform-client", "e2e", "Tests", "insight-dashboard-settings")),
    (os.path.join("eform-client", "e2e", "Tests", "insight-dashboard-general"),
     os.path.join("eform-client", "e2e", "Tests", "insight-dashboard-general")),
    (os.path.join("eform-client", "e2e", "Page objects", "InsightDashboard"),
     os.path.join("eform-client", "e2e", "Page objects", "InsightDashboard")),
    (os.path.join("eform-client", "wdio-headless-plugin-step2a.conf.ts"),
     os.path.join("eform-client", "wdio-headless-plugin-step2a.conf.ts")),
    (os.path.join("eform-client", "wdio-headless-plugin-step2b.conf.ts"),
     os.path.join("eform-client", "wdio-headless-plugin-step2b.conf.ts")),
    (os.path.join("eform-client", "wdio-headless-plugin-step2c.conf.ts"),
     os.path.join("eform-client", "wdio-headless-plugin-step2c.conf.ts")),
    (os.path.join("eform-client", "wdio-headless-plugin-step2d.conf.ts"),
     os.path.join("eform-client", "wdio-headless-plugin-step2d.conf.ts")),
    (os.path.join("eform-client", "wdio-headless-plugin-step2e.conf.ts"),
     os.path.join("eform-client", "wdio-headless-plugin-step2e.conf.ts")),
    (os.path.join("eform-client", "wdio-headless-plugin-step2f.conf.ts"),
     os.path.join("eform-client", "wdio-headless-plugin-step2f.conf.ts")),
    (os.path.join("eform-client", "wdio-headless-plugin-step2g.conf.ts"),
     os.path.join("eform-client", "wdio-headless-plugin-step2g.conf.ts")),
    (os.path.join("eFormAPI", "Plugins", "InsightDashboard.Pn"),
     os.path.join("eFormAPI", "Plugins", "InsightDashboard.Pn")),
    (os.path.join("eform-client", "cypress", "e2e", "plugins", "insight-dashboard-pn"),
     os.path.join("eform-client", "cypress", "e2e", "plugins", "insight-dashboard-pn")),
]

# Copy the files and directories
for src_rel_path, dst_rel_path in files_to_copy:
    src_path = os.path.join(src_base, src_rel_path)
    dst_path = os.path.join(dst_base, dst_rel_path)

    if os.path.exists(src_path):
        if os.path.isdir(src_path):
            shutil.copytree(src_path, dst_path)
        else:
            shutil.copy2(src_path, dst_path)
