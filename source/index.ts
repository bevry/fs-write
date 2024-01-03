// builtin
import { WriteFileOptions, writeFile as _writeFile } from 'fs'
import { dirname as _dirname } from 'path'

// external
import Errlop from 'errlop'
import mkdirp from '@bevry/fs-mkdirp'

/** Write contents to a file. */
export default async function write(
	path: string | Array<string>,
	contents: any,
	opts: WriteFileOptions = {}
): Promise<void> {
	if (Array.isArray(path)) {
		return Promise.all(path.map((i) => write(i, contents, opts))).then(() => {})
	}

	// ensure parent directories exist
	const parent = _dirname(path)
	try {
		await mkdirp(parent)
	} catch (err: any) {
		throw new Errlop(
			`unable to create the necessary directories of file: ${path}`,
			err
		)
	}

	// write the file
	return new Promise(function (resolve, reject) {
		_writeFile(path, contents, opts, function (err) {
			if (err) {
				return reject(new Errlop(`failed to write the file: ${path}`, err))
			}
			return resolve()
		})
	})
}
