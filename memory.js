module.exports = {
	save_to_memory: function(session_id, text) {
		memory[session_id] = text;
	},
	load_from_memory: function(session_id) {
		return memory[session_id];
	}
};

var memory = {};