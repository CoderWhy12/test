import SparkMD5 from "spark-md5";
export function getMD5(file) {
  return new Promise((resolve, reject) => {
    if (!process.env.VUE_APP_STORY_MD5_CHUNK_SIZE)
      throw new Error("环境变量VUE_APP_STORY_MD5_CHUNK_SIZE未配置");
    const blobSlice =
      File.prototype.slice ||
      File.prototype.mozSlice ||
      File.prototype.webkitSlice;
    const chunkSize = Number(process.env.VUE_APP_STORY_MD5_CHUNK_SIZE);
    const chunks = Math.ceil(file.size / chunkSize);
    let currentChunk = 0;
    const spark = new SparkMD5.ArrayBuffer();
    const fileReader = new FileReader();
    fileReader.onload = function(ev) {
      spark.append(ev.target.result);
      currentChunk++;
      if (currentChunk < chunks) {
        loadNext();
      } else {
        const md5 = spark.end();
        let type = file.type;
        if (!type) {
          const index1 = file.name.lastIndexOf(".");
          const index2 = file.name.length;
          const extname = file.name.substring(index1 + 1, index2);
          if (extname.toLowerCase() === "flv") {
            type = "video/mp4";
          } else if (extname.toLowerCase() === "psd") {
            type = "image/jpeg";
          }
        }
        resolve({ md5: md5, type: type });
      }
    };
    fileReader.onerror = function(err) {
      reject(err);
    };

    function loadNext() {
      const start = currentChunk * chunkSize,
        end = start + chunkSize >= file.size ? file.size : start + chunkSize;
      currentChunk = chunks;
      fileReader.readAsArrayBuffer(blobSlice.call(file, start, end));
    }

    loadNext();
  });
}
