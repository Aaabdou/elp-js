var cp = require('child_process');

const detachedProcess = cp.spawn('keep', [ '9847' ], {
  detached: true,
  stdio: 'ignore'
});

detachedProcess.unref();  // detache the child process




/* const { exec } = require('child_process');
exec('ping 8.8.8.8', (error, stdout, stderr) => {
  if (error) {
    console.error(`error: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`stderr: ${stderr}`);
    return;
  }
  console.log(`stdout:\n${stdout}`);
}); */