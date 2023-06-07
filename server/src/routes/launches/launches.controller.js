const {
	getAllLaunches,
	addNewLaunch,
	existsLaunchWithId,
	abortLaunchById,
} = require('../../models/launches.model');

function httpGetAllLaunches(req, res) {
	return res.status(200).json(getAllLaunches());
}

function httpAddNewLaunch(req, res) {
	const launch = req.body;

	if (
		!launch.mission ||
		!launch.rocket ||
		!launch.launchDate ||
		!launch.target
	) {
		return res.status(400).json({
			error: 'Missing required launch property',
		});
	}

	launch.launchDate = new Date(launch.launchDate);
	if (isNaN(launch.launchDate)) {
		return res.status(400).json({
			error: 'Invalid launch date',
		});
	}

	addNewLaunch(launch);
	return res.status(201).json(launch);
}

function httpAbortLaunch(req, res) {
	const launchId = Number(req.params.id);

	if (!existsLaunchWithId(launchId)) {
		return res.status(404).json({
			error: 'Launch not found',
		});
	}

	// check if the launch has already been launched
	// TODO: fix this, we don't have existing launch now
	const aborted = existsLaunch.upcoming;
	if (!aborted) {
		return res.status(400).json({
			error: 'Launch already aborted',
		});
	}

	// abort the launch
	abortLaunchById(launchId);
	return res.status(200).json({
		ok: true,
	});
}

module.exports = {
	httpGetAllLaunches,
	httpAddNewLaunch,
	httpAbortLaunch,
};
