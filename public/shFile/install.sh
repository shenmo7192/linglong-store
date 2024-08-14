#!/bin/bash  

# 确保脚本以root权限运行
if [ "$(id -u)" -ne "0" ]; then
    echo "请使用root权限运行此脚本"
    exit 1
fi

# 获取操作系统信息
OS=$(lsb_release -i | awk -F':' '{print $2}' | xargs)
VERSION=$(lsb_release -r | awk -F':' '{print $2}' | xargs)

# 根据操作系统版本执行相应的命令
case "$OS" in
    "Deepin")
        if [ "$VERSION" == "23" ]; then
            sudo apt update
            sudo apt install -y linglong-builder linglong-box linglong-bin
        else
            echo "不支持的 Deepin 版本: $VERSION"
            exit 1
        fi
        ;;
    "UOS")
        if [ "$VERSION" == "1070" ]; then
            echo "deb [trusted=yes] https://ci.deepin.com/repo/deepin/deepin-community/linglong-repo/ unstable main" | sudo tee -a /etc/apt/sources.list
            sudo apt update
            sudo apt install -y linglong-builder linglong-box linglong-bin
        else
            echo "不支持的 UOS 版本: $VERSION"
            exit 1
        fi
        ;;
    "OpenEuler")
        if [ "$VERSION" == "24.03" ]; then
            sudo curl -o /etc/yum.repos.d/linglong.repo -L https://eur.openeuler.openatom.cn/coprs/kamiyadm/linglong/repo/openeuler-24.03_LTS/kamiyadm-linglong-openeuler-24.03_LTS.repo
            sudo dnf update -y
            sudo dnf install -y linglong-builder linglong-box linglong-bin
        else
            echo "不支持的 OpenEuler 版本: $VERSION"
            exit 1
        fi
        ;;
    "Ubuntu")
        if [ "$VERSION" == "24.04" ]; then
            sudo bash -c "echo 'deb [trusted=yes] https://download.opensuse.org/repositories/home:/kamiyadm/xUbuntu_24.04/ ./' > /etc/apt/sources.list.d/linglong.list"
            sudo apt update
            sudo apt install -y linglong-builder linglong-box linglong-bin
        else
            echo "不支持的 Ubuntu 版本: $VERSION"
            exit 1
        fi
        ;;
    "Debian")
        if [ "$VERSION" == "12" ]; then
            sudo bash -c "echo 'deb [trusted=yes] https://download.opensuse.org/repositories/home:/kamiyadm/Debian_12/ ./' > /etc/apt/sources.list.d/linglong.list"
            sudo apt update
            sudo apt install -y linglong-builder linglong-box linglong-bin
        else
            echo "不支持的 Debian 版本: $VERSION"
            exit 1
        fi
        ;;
    "openKylin")
        if [ "$VERSION" == "2.0rc" ]; then
            sudo bash -c "echo 'deb [trusted=yes] https://ci.deepin.com/repo/obs/linglong:/multi_distro/openkylin2.0_repo/ ./' > /etc/apt/sources.list.d/linglong.list"
            sudo apt update
            sudo apt install -y linglong-builder linglong-box linglong-bin
        else
            echo "不支持的 openKylin 版本: $VERSION"
            exit 1
        fi
        ;;
    *)
        echo "不支持的操作系统: $OS"
        exit 1
        ;;
esac

echo "安装完成"