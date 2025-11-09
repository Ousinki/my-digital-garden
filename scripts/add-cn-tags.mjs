import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 检查是否包含中文字符
function containsChinese(text) {
  return /[\u4e00-\u9fff]/.test(text);
}

// 检查是否已经被 <span class="cn"> 包裹
function isWrappedInCnTag(text) {
  return text.trim().startsWith('<span class="cn">') || 
         text.includes('<span class="cn">');
}

// 处理单行文本
function processLine(line) {
  const trimmed = line.trim();
  
  // 如果行是空的或只包含空白，直接返回
  if (!trimmed) {
    return line;
  }
  
  // 如果已经包含 <span class="cn">，直接返回
  if (isWrappedInCnTag(line)) {
    return line;
  }
  
  // 如果包含中文字符，需要添加标签
  if (containsChinese(trimmed)) {
    // 检查行首是否有缩进
    const leadingWhitespace = line.match(/^(\s*)/)?.[1] || '';
    const content = trimmed;
    
    // 检查是否是混合行（包含英文和中文）
    // 匹配模式：英文内容后跟中文内容（可能有空格分隔）
    const mixedPattern = /^(.+?)(\s*[（\u4e00-\u9fff].+)$/;
    const mixedMatch = content.match(mixedPattern);
    
    if (mixedMatch) {
      // 混合行：英文部分 + 中文部分
      const englishPart = mixedMatch[1].trim();
      const chinesePart = mixedMatch[2].trim();
      
      // 只包裹中文部分
      return leadingWhitespace + englishPart + ' <span class="cn">' + chinesePart + '</span>';
    }
    
    // 如果整行都是中文（或主要是中文），直接包裹
    if (content.startsWith('♪') || content.startsWith('（') || content.match(/^[♪（\u4e00-\u9fff]/)) {
      // 纯中文内容，直接包裹
      return leadingWhitespace + '<span class="cn">' + content + '</span>';
    }
    
    // 如果以中文开头
    if (content.match(/^[\u4e00-\u9fff]/)) {
      return leadingWhitespace + '<span class="cn">' + content + '</span>';
    }
    
    // 包含中文但可能混合其他内容
    // 如果整行主要是中文，就包裹整行
    const chineseRatio = (content.match(/[\u4e00-\u9fff]/g) || []).length / content.length;
    if (chineseRatio > 0.3) {
      // 中文占比高，包裹整行
      return leadingWhitespace + '<span class="cn">' + content + '</span>';
    }
  }
  
  return line;
}

// 主函数
function addCnTags(filePath) {
  console.log(`处理文件: ${filePath}`);
  
  const content = readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  let modified = false;
  
  const processedLines = lines.map((line, index) => {
    const original = line;
    const processed = processLine(line);
    
    if (original !== processed) {
      modified = true;
      console.log(`  修改第 ${index + 1} 行`);
    }
    
    return processed;
  });
  
  if (modified) {
    writeFileSync(filePath, processedLines.join('\n'), 'utf-8');
    console.log(`✓ 文件已更新: ${filePath}`);
  } else {
    console.log(`- 无需修改: ${filePath}`);
  }
}

// 从命令行参数获取文件路径
const filePath = process.argv[2];

if (!filePath) {
  console.error('用法: node scripts/add-cn-tags.mjs <文件路径>');
  process.exit(1);
}

const fullPath = resolve(process.cwd(), filePath);
addCnTags(fullPath);

